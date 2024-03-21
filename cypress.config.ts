import { defineConfig } from "cypress";

export default defineConfig({
    env: {
        'frontend_url': 'http://dev-rootdb-frontend-react.localhost.com',
        'user_super-admin': 'super-admin',
        'user_super-admin_default_password': 'rootdbadmin',
        'user_super-admin_password': 'leetiiri8ogh4deecohCuigh9meToa',
        'user_testuser': 'testuser',
        'user_testiser_password': 'xied1Hax3ipovooquohgaeNai7ohya',
        'license_key': 'F8jV1Xu2LyjgtFh0LqOF3zBvQuxD2PDPSyU5iQjHo3Eb7SwvKf1Gwhq3sYSupDwNeuKuKkZg6PUU7KiZo8zlfqq/gUFp9uUs/lVX2YAVDNQ9dLi9LW4aQ2toNtc8FHF7+P/DVG5NTERGtb5rMJdLq10pEkvGhGsw32XYma9vq8+n2/09VnPv9fRgzxYSXADZAYhlPeitq4rn13aezoDFUJUX4jDO9NWnbF9PA3qd5H4BARwz2IaU5+Bf/+hLc0J46VTel3CmlqfZ3XlHACFTGLtfMEz/stinIjY9+M/7Dc5VgHv6x419FbuCYoO5BbGlqx1R75vRa+1QPSj07OsOEN0JdswfuF5gp/GiAbylQY9dfxYDw608orRBWao6J/Cdos9Awv01iSBhVMcUTzYdgc+Lrxtx8s7wJzEj3NLVhtFZm+z+iAjnPxT1Ltaiv7cl7OmG3QDPAkm3xtpo1qy9ft9N7Qd3Zfj4FXlwd/35j/6kn+iqG4Y0vKnhGcj1MQoCTHQLX1sT7ObtqESKgS1KXbAQHoDaEj28ctF5HGi2T1EqMSJ526bdiALxEO1UBPaemSrosn6aBf4LSANSbepm0KTUZy4FJclYhEOnX19xuG6yd4TQOxDLtPC/SueY6GPp0I/cfjHanuEwecJ6yqoVkmfvl5eHB2X7PE8WOOM0bpsdhw2yOhj91I/6GeWSAmr4RCa9/tcvPzdLl+GzDL4iJtBwB1pmA/F8INCgKVM+uPGXObcssENJoy1AZ4yO4PicDR7i/5CNX7jZPI9gSjLlbk+RUkjp40yb7cytsnyz3Uuwl2n8W4bV5Kni2IEi/bIqZEg1/VsFnk5l6H+s3NrJi/IlfifIrGQwsiG8OEUFX3CN+XqBdEjvGAciAvQv13EPnmMD+lD6Gjlkxn1o7LW2tqKnXpj4XdUozXfdZwKH6DDtvUyHyd+ULrzkQErvWyAvcRClM1L5lc0t/qd+fWF78ipKb8hlLZdwyo500JXkIrQVTc9BqMFCI54rEXSLE36ZsZGPXc5Vv7E1irrMlCsa8xP5SJyUOWCFDIRQz6z1m5StdBhIzt2D/WGU+0AXhY2wj3XlF0Ee5F+C8O2z6kgncQXsbtElttVeiEpTSt2hoYzs6156uaZ2WOMG+n3yWliCOT9AJYSKtYor4h6uh96KPoyGXQ9X11M+FkKwJwEKJSD3UXha372PJGJKU8LbSeywC3ltEoOfxN9Vdo+XC+r2gDbkAWg4B6iNUlnH4Dde6ZgVBH/Fa62/fs19JdUapWsJtuYeNRlha/W3SLhWZhM6v2eD0q8FfWOMbn4P3oA9z/0AYlGqoOvFEmtwEjtwEFleU2UcH2DInaasxlMuatRy0Q==',
        'conf_connector_name': 'test-db connection',
        'conf_connector_host': '5.135.30.182',
        'conf_connector_database_name': 'test-db',
        'conf_connector_database_user': 'up_test_db',
        'conf_connector_database_password': 'thootohPhah9OoWu6SooMo3iquai9i',
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
