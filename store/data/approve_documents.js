import {createCRUD} from '~/plugins/crud';

const crudModule = createCRUD({
    resource: 'platform/approve_documents',
});

const state = () => crudModule.state;
const { actions, mutations, getters } = crudModule;

export {
    state,
    actions,
    mutations,
    getters
}
