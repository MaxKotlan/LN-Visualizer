import { createAction, props } from "@ngrx/store";

export const searchGraph = createAction(
    '[controls] setSearchString',
    props<{searchText: string}>()
);

export const renderEdges = createAction(
    '[controls] renderEdges',
    props<{value: boolean}>()
);

export const sortOrderChange = createAction(
    '[controls] setSortOrder',
    props<{ascending: boolean}>()
);

export const gotoNode = createAction(
    '[controls] gotoNode'
);

export const minEdgesRecompute = createAction(
    '[controls] setMinimumEdges',
    props<{minEdges: number}>()
);
