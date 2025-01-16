import { PageLayoutTypes } from '../helpers/page-layout-constants';

export type PageType = (typeof PageLayoutTypes)[keyof typeof PageLayoutTypes];
