import {createCRUD} from '~/plugins/crud';

const crudModule = createCRUD({
    resource: 'platform/currency',
});

const state = () => crudModule.state;
const { actions, mutations, getters } = crudModule;

export {
    state,
    actions,
    mutations,
    getters
}
