import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplicationContribution, FrontendApplication } from "@theia/core/lib/browser";
import { FileSystem } from '@theia/filesystem/lib/common/filesystem';
import { EventManager, CommandType, IdeCommand } from "calpvin-ide-shared";

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
                this.messageService.info('Norm');


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

    private eventManager: EventManager;

    async onStart?(app: FrontendApplication): Promise<void> {
        this.eventManager = new EventManager(window, parent, (e: MessageEvent) => { this.receiveEventListener(e); });

        // this.eventManager.sendEvent({
        //     commandType: CommandType.ReadFile,
        //     uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        //     data: 'dsabnbsksBBBBBBBBBBBBBBBBBBB!!'
        // }, false);
    }

    private async receiveEventListener(e: MessageEvent) {
        console.log('Ide: ', e);

        const command = e.data as IdeCommand;

        if (command.commandType === CommandType.ReadFile) {
            const path = await this.fileSystem.getFsPath('file:///home/project/calpvin-ide-ui/src/app/app.component.html');
            const fileContent = await this.fileSystem.resolveContent(path!);

            this.eventManager.sendEvent({
                commandType: CommandType.ReadFile,
                uniqueIdentifier: e.data.uniqueIdentifier,
                data: fileContent.content
            }, false);
        }
        else if (command.commandType === CommandType.WriteFile) {
            const fileStat = await this.fileSystem.getFileStat('file:///home/project/calpvin-ide-ui/src/app/app.component.html');
            await this.fileSystem.setContent(fileStat!, e.data.data);
        }

    }
}
