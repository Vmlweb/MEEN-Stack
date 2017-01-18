//const requireAll = (requireContext) => { requireContext.keys().map(requireContext); };
 
//requireAll(require.context('/', true, /\hello.test.ts$/));

require.context('/', true, 'hello.test.ts')