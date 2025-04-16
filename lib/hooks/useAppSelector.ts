import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * 型安全なuseSelector hook
 * Reduxの状態から型情報を保持したまま値を取得する
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 