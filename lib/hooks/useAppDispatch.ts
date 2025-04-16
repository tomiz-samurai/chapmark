import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

/**
 * 型安全なuseDispatch hook
 * Reduxのdispatchを型情報を保持したまま使用する
 */
export const useAppDispatch = () => useDispatch<AppDispatch>(); 