import { createAction, props } from "@ngrx/store";

export const searchGraph = createAction(
    '[controls] setSearchString',
    props<{searchText: string}>()
);