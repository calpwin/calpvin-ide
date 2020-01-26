/**
 * Generated using theia-extension-generator
 */

import { CalpvinTheiaCustomCommandContribution, CalpvinTheiaCustomMenuContribution, CalpvinTheiaFrontendApplicationContribution } from './calpvin-theia-custom-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { FrontendApplicationContribution } from '@theia/core/lib/browser';

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(CalpvinTheiaCustomCommandContribution);
    bind(MenuContribution).to(CalpvinTheiaCustomMenuContribution);
    bind(FrontendApplicationContribution).to(CalpvinTheiaFrontendApplicationContribution);
});
