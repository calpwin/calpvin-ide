import { injectable, inject } from "inversify";
import { CommandContribution, CommandService, MenuContribution, MenuModelRegistry, MessageService, CommandRegistry } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplicationContribution, FrontendApplication, PreferenceServiceImpl } from "@theia/core/lib/browser";
import { FileSystem } from '@theia/filesystem/lib/common/filesystem';
import { EventManager, EventType, IdeEvent, VirtualFile, Workspace } from "calpvin-ide-shared";
import { WorkspaceService, WorkspaceData } from '@theia/workspace/lib/browser/workspace-service';
import { WorkspaceServer, THEIA_EXT } from "@theia/workspace/lib/common";
import URI from "@theia/core/lib/common/uri";
import { WorkspacePreferences } from "@theia/workspace/lib/browser/workspace-preferences";
import * as jsoncparser from 'jsonc-parser';

export const CalpvinTheiaCustomCommand = {
    id: 'CalpvinTheiaCustom.command',
    label: "Shows a message"
};

@injectable()
export class CalpvinTheiaCustomCommandContribution implements CommandContribution {

    @inject(FileSystem)
    protected readonly fileSystem: FileSystem;

    // @inject(SourceTreeWidget)
    // protected readonly sourceTreeWidget: SourceTreeWidget;

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(CalpvinTheiaCustomCommand, {
            execute: async () => {
                this.messageService.info('Norm ok 22!');


            }
        });
    }
}

@injectable()
export class CalpvinTheiaCustomMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: CalpvinTheiaCustomCommand.id,
            label: 'Say Hello'
        });
    }
}

@injectable()
export class CalpvinTheiaFrontendApplicationContribution implements FrontendApplicationContribution {

    @inject(FileSystem)
    protected readonly fileSystem: FileSystem;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(WorkspaceServer)
    protected readonly workspaceServer: WorkspaceServer;

    @inject(PreferenceServiceImpl)
    protected readonly preferenceServiceImpl: PreferenceServiceImpl;

    @inject(WorkspacePreferences)
    protected workspacePreferences: WorkspacePreferences;

    private eventManager: EventManager;
    _workspaceFileUri: URI;
    private _activeWorkspace = new Workspace();

    async onStart?(app: FrontendApplication): Promise<void> {

        const userHome = await this.fileSystem.getCurrentUserHome();
        const homeDirPath = await this.fileSystem.getFsPath(userHome!.uri);
        this._workspaceFileUri = new URI(homeDirPath).resolve('.theia').resolve(`developer.${THEIA_EXT}`).withScheme('file');
        await this.workspaceService.save(this._workspaceFileUri);

        this._activeWorkspace.activeComponent = 'test-component';
        this._activeWorkspace.activeModule = 'test-module';
        await this.setActiveWorkplace();

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'q') {
                this.eventManager.sendEvent({
                    eventType: EventType.AppHideIde,
                    uniqueIdentifier: EventManager.generateUniqueIdentifire(),
                    data: 'Command: Hide Ide'
                }, false);
            }
        });

        this.eventManager = new EventManager(window, parent, (e: MessageEvent) => { this.receiveEventListener(e); });

        this.eventManager.sendEvent({
            eventType: EventType.IdeStartEvent,
            uniqueIdentifier: EventManager.generateUniqueIdentifire(),
            data: 'Ide Start!'
        }, false);

        this.eventManager.sendEvent<Workspace>({
            eventType: EventType.SetWorkspace,
            uniqueIdentifier: EventManager.generateUniqueIdentifire(),
            data: this._activeWorkspace
        }, false);
    }

    private async receiveEventListener(e: MessageEvent) {
        console.log('Ide: ', e);

        const command = e.data as IdeEvent<any>;

        if (command.eventType === EventType.ReadComponentFile) {
            const componentName = (command.data as VirtualFile).componentName;
            const fileName = (command.data as VirtualFile).fileName;
            const path = await this.fileSystem.getFsPath(`file:///home/project/calpvin-ide-ui/src/app/test-module/${componentName}/${fileName}`);
            const fileContent = await this.fileSystem.resolveContent(path!);

            (command.data as VirtualFile).content = fileContent.content;

            this.eventManager.sendEvent({
                eventType: EventType.ReadComponentFile,
                uniqueIdentifier: e.data.uniqueIdentifier,
                data: command.data
            }, false);
        }
        else if (command.eventType === EventType.WriteComponentFile) {
            const componentName = (command.data as VirtualFile).componentName;
            const fileName = (command.data as VirtualFile).fileName;
            const fileStat = await this.fileSystem.getFileStat(`file:///home/project/calpvin-ide-ui/src/app/test-module/${componentName}/${fileName}`);
            await this.fileSystem.setContent(fileStat!, (command.data as VirtualFile).content!);
        }
        else if (command.eventType == EventType.SetWorkspace) {
            this._activeWorkspace = command.data as Workspace;

            this.setActiveWorkplace();
        }
        else if (command.eventType == EventType.GetWorkspace) {
            this.eventManager.sendEvent({
                eventType: EventType.SetWorkspace,
                uniqueIdentifier: e.data.uniqueIdentifier,
                data: this._activeWorkspace
            }, false);
        }
        // else if (command.eventType === EventType.IdeSetWorkspace) {
        //     // const commandData = command.data as SetWorkspaceCommandData;

        //     // await this.preferenceServiceImpl.set('folders', '[]', PreferenceScope.Workspace);


        //     // const stat = await this.fileSystem.setContent(this.workspaceService.workspace!, result);

        //     const { content } = await this.fileSystem.resolveContent(this._workspaceFileUri.toString());

        //     const workspaceJson = jsoncparser.parse(content);

        //     (workspaceJson as WorkspaceData).folders = [{ path: 'file:///home/project/calpvin-ide-ui/src/app' }];

        //     const worspaceContentEdited = JSON.stringify(workspaceJson);

        //     const fileStat = await this.fileSystem.getFileStat(this._workspaceFileUri.toString());
        //     await this.fileSystem.setContent(fileStat!, worspaceContentEdited);

        //     // const allRoots = this.workspaceService.tryGetRoots().map(x => new URI(x.uri));            

        //     // const userHome = await this.fileSystem.getCurrentUserHome();
        //     // const homeDirPath = await this.fileSystem.getFsPath(userHome!.uri);
        //     // const untitledWorkspace = getTemporaryWorkspaceFileUri(new URI(homeDirPath));

        //     // await this.workspaceService.spliceRoots(0, allRoots.length);            
        //     // await this.workspaceService.spliceRoots(0, 0, new URI('/home/project/calpvin-ide-ui/src/app'));
        //     // await this.workspaceService.save(new URI('/home/project/hosts.theia-workspace'));


        //     // console.log(homeDirPath);
        //     // console.log(untitledWorkspace);
        //     // console.log(commandData);


        //     // await this.workspaceService.addRoot(new URI(commandData.rootUris[0]));

        //     // await this.workspaceService.removeRoots([new URI('/home/project/calpvin-ide-ui')]);
        //     // console.log(allRoots);

        //     // commandData.rootUris.forEach(uri => this.workspaceService.addRoot(new URI(uri)));
        // }
    }

    private async setActiveWorkplace() {
        const { content } = await this.fileSystem.resolveContent(this._workspaceFileUri.toString());

        const workspaceJson = jsoncparser.parse(content);

        (workspaceJson as WorkspaceData).folders = [{ path: `file:///home/project/calpvin-ide-ui/src/app/${this._activeWorkspace.activeModule}` }];

        const worspaceContentEdited = JSON.stringify(workspaceJson);

        const fileStat = await this.fileSystem.getFileStat(this._workspaceFileUri.toString());
        await this.fileSystem.setContent(fileStat!, worspaceContentEdited);
    }
}
