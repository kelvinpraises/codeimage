import {EnvironmentProvider} from '../core/configuration';
import {createStore, select, setProp, withProps} from '@ngneat/elf';
import {distinctUntilChanged, map} from 'rxjs';
import shallow from '../core/helpers/shallow';
import {localStorageStrategy, persistState} from '@ngneat/elf-persist-state';
import {persistQuery} from '../core/helpers/persistQuery';
import {inject} from 'solid-use';

interface EditorState {
  languageId: string;
  themeId: string;
  code: string;
  fontId: string;
  fontWeight: number;
  showLineNumbers: boolean;
  focused: boolean;
}

const {languages, themes, fonts, defaultState} = inject(EnvironmentProvider);

// TODO: should be loaded onMount, initial state cannot use this configuration
const initialState: EditorState = {
  code: defaultState.editor.code,
  languageId: languages[0].id,
  themeId: themes[0].id,
  showLineNumbers: false,
  fontId: fonts[0].id,
  fontWeight: fonts[0].types[0].weight,
  focused: false,
};

const store = createStore(
  {name: 'editor'},
  withProps<EditorState>(initialState),
);

export const updateEditorStore = store.update.bind(store);

persistState(store, {storage: localStorageStrategy, key: '@store/editor'});
persistQuery(store, {
  key: 'editor',
  keysToSync: [
    'code',
    'languageId',
    'themeId',
    'showLineNumbers',
    'fontId',
    'fontWeight',
  ],
});

export function setLanguageId(languageId: string) {
  store.update(setProp('languageId', languageId));
}

export function setCode(code: string) {
  store.update(setProp('code', code));
}

export function setTheme(themeId: string) {
  store.update(setProp('themeId', themeId));
}

export function setShowLineNumbers(show: boolean) {
  store.update(setProp('showLineNumbers', show));
}

export function setFontId(fontId: string) {
  store.update(setProp('fontId', fontId));
}

export function setFontWeight(fontWeight: number) {
  store.update(setProp('fontWeight', fontWeight));
}

export function setFocus(focused: boolean) {
  store.update(setProp('focused', focused));
}

export const editor$ = store.pipe(distinctUntilChanged(shallow));

const fontId$ = editor$.pipe(select(store => store.fontId));

export const editorLanguageId$ = editor$.pipe(
  select(store => store.languageId),
);

export const font$ = fontId$.pipe(
  map(id => fonts.find(font => font.id === id)),
);

export const focusedEditor$ = editor$.pipe(select(store => store.focused));
