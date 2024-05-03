import { defineConfig } from "cypress";

export default defineConfig({
    env: {
        'frontend_url': 'http://dev-rootdb-frontend-react.localhost.com',
        'user_super-admin': 'super-admin',
        'user_super-admin_default_password': 'rootdbadmin',
        'user_super-admin_password': 'leetiiri8ogh4deecohCuigh9meToa',
        'user_testuser': 'testuser',
        'user_testiser_password': 'xied1Hax3ipovooquohgaeNai7ohya',
        'conf_connector_name': 'test-db connection',
        'conf_connector_host': '',
        'conf_connector_database_name': '',
        'conf_connector_database_user': '',
        'conf_connector_database_password': '',
    },

    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: "create-react-app",
            bundler: "webpack",
        },
    },
});
