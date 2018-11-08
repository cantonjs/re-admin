import { createContext } from 'utils/reactPolyfill';

const context = createContext();
context.displayName = 'PageContext';

export default context;
