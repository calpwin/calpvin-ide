import { injectable, inject } from "inversify";
import { CommandContribution, CommandService, MenuContribution, MenuModelRegistry, MessageService, CommandRegistry } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplicationContribution, FrontendApplication} from "@theia/core/lib/browser";
import { FileSystem } from '@theia/filesystem/lib/common/filesystem';
import { EventManager, EventType, IdeEvent, VirtualFile } from "calpvin-ide-shared";
// import {WorkspaceCommands} from '@theia/workspace/lib/browser/workspace-commands';
import {WorkspaceService} from '@theia/workspace/lib/browser/workspace-service';
import URI from '@theia/core/lib/common/uri';

// import { FileNavigatorCommands } from '@theia/navigator/lib/browser/navigator-contribution';

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

    private eventManager: EventManager;

    async onStart?(app: FrontendApplication): Promise<void> {

        console.log('OK!!');
        await this.workspaceService.addRoot(new URI('/home/project/calpvin-ide-ui'));
        
        setTimeout(async () => {
            await this.workspaceService.removeRoots([new URI('/home/project/calpvin-ide-ui')]);
            await this.workspaceService.addRoot(new URI('/home/project/calpvin-ide-ui/src'));
        }, 7000);

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'q') {
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
    }

    private async receiveEventListener(e: MessageEvent) {
        console.log('Ide: ', e);

        const command = e.data as IdeEvent<VirtualFile>;

        if (command.eventType === EventType.ReadComponentFile) {
            const componentName = (command.data as VirtualFile).componentName;
            const path = await this.fileSystem.getFsPath(`file:///home/project/calpvin-ide-ui/src/app/${componentName}/${componentName}.component.html`);
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
            const fileStat = await this.fileSystem.getFileStat(`file:///home/project/calpvin-ide-ui/src/app/${componentName}/${componentName}.component.html`);
            await this.fileSystem.setContent(fileStat!, (command.data as VirtualFile).content!);
        }        
    }
}
