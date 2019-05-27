const SvelteCompiler = require('../index.js');
const svelteComponent = require('./svelteStub.js');

const args = {
  path: '/test.svelte',
  data: svelteComponent
}

test('compiles file data for bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(args)
  expect(result.data).toMatchSnapshot();
});

test('attributes correct source file for bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(args)
  expect(result.map.sources[0]).toBe('/test.svelte')
});