import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplicationContribution, FrontendApplication } from "@theia/core/lib/browser";
import { FileSystem } from '@theia/filesystem/lib/common/filesystem';
import  {Hello} from "calpvin-ide-shared";

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
                this.messageService.info(new Hello().say());


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

    async onStart?(app: FrontendApplication): Promise<void> {
        window.addEventListener("message", (e: MessageEvent) => {
            if (e.origin === 'http://localhost:3000') {
                return;
            }

            console.log('Iframe receive message', e);
        });

        //const fileContent = await this.fileSystem.resolveContent( 'lerna.json');

        const path = await this.fileSystem.getFsPath('file:///home/project/lerna.json');
        const content = await this.fileSystem.resolveContent(path!);

        console.log('Content: ', content.content);

        // parent.postMessage({ fileContent: fileContent.content}, '*');
    }
}
