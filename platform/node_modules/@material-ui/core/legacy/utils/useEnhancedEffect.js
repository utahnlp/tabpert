import * as React from 'react';
var useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
/**
 * Private module reserved for @material-ui packages.
 */

export default useEnhancedEffect;