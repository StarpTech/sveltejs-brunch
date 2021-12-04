const SvelteCompiler = require('../index.js');
const svelteComponent = require('./svelteStub.js');
const sourceSevelteComponent = require('./source/sourceTest.js');

const args = {
  path: '/test.svelte',
  data: svelteComponent
}

const sourceTestArgs = {
    path: '/source/sourceTest.svelte',
    data: sourceSevelteComponent
};

test('compiles file data for bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(args)
  expect(result.data).toMatchSnapshot();
});

test('compiles nested file data for bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(sourceTestArgs);
  expect(result.data).toMatchSnapshot();
});

test('attributes correct source file for bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(args)
  expect(result.map.sources[0]).toBe('/test.svelte')
});

test('attributes correct source file for sourceTest bar chart example from svelte site', async () => {
  const compiler = new SvelteCompiler({plugins: {}})
  const result = await compiler.compile(sourceTestArgs)
  expect(result.map.sources[0]).toBe('/source/sourceTest.svelte')
});

test('original file path is preserved in js sourcemap for brunch', async () => {
    const compiler = new SvelteCompiler({plugins: {}});
    const result = await compiler.compile(sourceTestArgs);
    const sources = result.map.sources.toString();
    expect(sources).toEqual(['/source/sourceTest.svelte'].toString());
});
