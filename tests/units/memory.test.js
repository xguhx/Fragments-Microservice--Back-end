const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory/index.js');

describe('memory Index.js functions', () => {
  //Example provided:
  // test('Student case - https://github.com/humphd/ccp555-winter-2022/discussions/53', async () => {
  //   // Create 3 pretend fragments for owner=aa, and put some data in each

  //   // fragment1 metadata and data
  //   await writeFragment({ ownerId: 'aa', id: '1', fragment: 'pretend fragment 1' });
  //   await writeFragmentData('aa', '1', 'This is fragment 1');

  //   // fragment2 metadata and data
  //   await writeFragment({ ownerId: 'aa', id: '2', fragment: 'pretend fragment 2' });
  //   await writeFragmentData('aa', '2', 'This is fragment 2');

  //   // fragment3 metadata and data
  //   await writeFragment({ ownerId: 'aa', id: '3', fragment: 'pretend fragment 3' });
  //   await writeFragmentData('aa', '3', 'This is fragment 3');

  //   // 1. Get back a list of only fragment ids for owner=aa
  //   const ids = await listFragments('aa');
  //   expect(Array.isArray(ids)).toBe(true);
  //   expect(ids).toEqual(['1', '2', '3']);

  //   // 2. Get back a list of expanded fragments for owner=aa
  //   const fragments = await listFragments('aa', true);
  //   expect(Array.isArray(fragments)).toBe(true);
  //   expect(fragments).toEqual([
  //     { ownerId: 'aa', id: '1', fragment: 'pretend fragment 1' },
  //     { ownerId: 'aa', id: '2', fragment: 'pretend fragment 2' },
  //     { ownerId: 'aa', id: '3', fragment: 'pretend fragment 3' },
  //   ]);
  // });

  const mockFragment1 = { ownerId: 'f1', id: '1', fragment: 'This is the Fragment1 metadata' };
  const mockFragment2 = { ownerId: 'f1', id: '2', fragment: 'This is the Fragment2 metadata' };

  test('Write data and metadata to the In-Memory DB', async () => {
    // Create 3 pretend fragments for owner=aa, and put some data in each

    // fragment1 metadata and data
    await writeFragment(mockFragment1);
    await writeFragmentData('f1', '1', 'This is fragment 1');

    // fragment2 metadata and data
    await writeFragment(mockFragment2);
    await writeFragmentData('f1', '2', 'This is fragment 2');
  });

  test('Get the list of fragments', async () => {
    // 1. Get back a list of only fragment ids for owner=aa
    const ids = await listFragments('f1');
    expect(Array.isArray(ids)).toBe(true);
    expect(ids).toEqual(['1', '2']);

    // 2. Get back a list of expanded fragments for owner=aa
    const fragments = await listFragments('f1', true);
    expect(Array.isArray(fragments)).toBe(true);
    expect(fragments).toEqual([
      { ownerId: 'f1', id: '1', fragment: 'This is the Fragment1 metadata' },
      { ownerId: 'f1', id: '2', fragment: 'This is the Fragment2 metadata' },
    ]);
  });

  test('readFragment', async () => {
    expect(await readFragment('f1', '1')).toEqual(mockFragment1);
  });

  test('readFragmentData', async () => {
    expect(await readFragmentData('f1', '1')).toEqual('This is fragment 1');
  });

  test('deleteFragment', async () => {
    expect(await deleteFragment('f1', '1')).toBeDefined();
  });
});
