describe.only('super-admin login & license registration', () => {

    it('Invalid password provided', () => {

        cy.exec('docker exec -u rootdb dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api  < /home/share/Developments/atomicweb/rootdb/api/storage/app/seeders/production/seeder_init.sql')
        cy.visit(Cypress.env('frontend_url'))

        cy.intercept({
            method: 'POST',
            url: '/api/login*',
        }).as('apiLogin')

        cy.get('input[name=username]').type(Cypress.env('user_super-admin'))
        cy.get('input[name=password]').type(`${Cypress.env('user_super-admin_default_password')}fdsfsd{enter}`)

        cy.wait('@apiLogin').then((interception) => {

            console.log(interception)
            expect(interception?.response?.body).to.deep.equal({
                errors: null,
                message: "Impossible de s'authentifier avec ce nom d'utilisateur et mot de passe.",
                status: "Error",
                title: "Erreur d'authentification"
            })
        })
    })

    it('Valid password provided, change password, register licence', () => {

        cy.exec('docker exec -u rootdb dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api  < /home/share/Developments/atomicweb/rootdb/api/storage/app/seeders/production/seeder_init.sql')
        cy.visit(Cypress.env('frontend_url'))

        cy.intercept({
            method: 'POST',
            url: '/api/login*',
        }).as('apiLogin')

        // Login with default super-admin password.
        cy.get('input[name=username]').type(Cypress.env('user_super-admin'))
        cy.get('input[name=password]').type(`${Cypress.env('user_super-admin_default_password')}{enter}`)

        cy.wait('@apiLogin').then((interception) => {

            expect(interception?.response?.body).to.deep.equal(
                {
                    "status": "Success",
                    "title": "Opération terminée",
                    "message": "Authentifié.",
                    "data": {
                        "is_licence_valid": false,
                        "license_options": [],
                        "license_type": "",
                        "email": "super-admin@domain",
                        "email_verified_at": "2022-07-21T10:48:45.000000Z",
                        "firstname": "super-admin",
                        "lastname": "super-admin",
                        "id": 1,
                        "is_active": true,
                        "reset_password": true,
                        "first_connection": false,
                        "name": "super-admin",
                        "organization_user": {
                            "id": 1,
                            "user_id": 1,
                            "organization_id": 1,
                            "groups": [],
                            "group_ids": [],
                            "organization": {
                                "id": 1,
                                "name": "Organisation",
                                "conf_connectors": []
                            },
                            "roles": [
                                {
                                    "id": 1,
                                    "name": "Administrator"
                                },
                                {
                                    "id": 2,
                                    "name": "Developer"
                                },
                                {
                                    "id": 3,
                                    "name": "Viewer"
                                }
                            ],
                            "role_ids": [
                                1,
                                2,
                                3
                            ],
                            "ui_grants": {
                                "cache": {
                                    "edit": false
                                },
                                "category": {
                                    "edit": true
                                },
                                "conf_connector": {
                                    "edit": true
                                },
                                "draft": {
                                    "edit": true
                                },
                                "draft_queries": {
                                    "edit": true
                                },
                                "directory": {
                                    "edit": true
                                },
                                "group": {
                                    "edit": true
                                },
                                "license": {
                                    "edit": true
                                },
                                "organization": {
                                    "edit": true
                                },
                                "report": {
                                    "edit": true
                                },
                                "report_data_view": {
                                    "edit": true
                                },
                                "report_data_view_js": {
                                    "edit": true
                                },
                                "report_parameter_input": {
                                    "edit": true
                                },
                                "report_parameter": {
                                    "edit": true
                                },
                                "user": {
                                    "edit": true
                                },
                                "user_preferences": {
                                    "edit": true
                                },
                                "system_info": {
                                    "edit": true
                                },
                                "service_message": {
                                    "edit": true
                                }
                            },
                            "user_preferences": {
                                "id": 53,
                                "lang": "fr",
                                "theme": "saga-blue"
                            }
                        },
                        "organization_users": [
                            {
                                "id": 1,
                                "user_id": 1,
                                "organization_id": 1,
                                "groups": [],
                                "group_ids": [],
                                "organization": {
                                    "id": 1,
                                    "name": "Organisation",
                                    "conf_connectors": []
                                },
                                "roles": [
                                    {
                                        "id": 1,
                                        "name": "Administrator"
                                    },
                                    {
                                        "id": 2,
                                        "name": "Developer"
                                    },
                                    {
                                        "id": 3,
                                        "name": "Viewer"
                                    }
                                ],
                                "role_ids": [
                                    1,
                                    2,
                                    3
                                ],
                                "ui_grants": {
                                    "cache": {
                                        "edit": false
                                    },
                                    "category": {
                                        "edit": true
                                    },
                                    "conf_connector": {
                                        "edit": true
                                    },
                                    "draft": {
                                        "edit": true
                                    },
                                    "draft_queries": {
                                        "edit": true
                                    },
                                    "directory": {
                                        "edit": true
                                    },
                                    "group": {
                                        "edit": true
                                    },
                                    "license": {
                                        "edit": true
                                    },
                                    "organization": {
                                        "edit": true
                                    },
                                    "report": {
                                        "edit": true
                                    },
                                    "report_data_view": {
                                        "edit": true
                                    },
                                    "report_data_view_js": {
                                        "edit": true
                                    },
                                    "report_parameter_input": {
                                        "edit": true
                                    },
                                    "report_parameter": {
                                        "edit": true
                                    },
                                    "user": {
                                        "edit": true
                                    },
                                    "user_preferences": {
                                        "edit": true
                                    },
                                    "system_info": {
                                        "edit": true
                                    },
                                    "service_message": {
                                        "edit": true
                                    }
                                },
                                "user_preferences": {
                                    "id": 53,
                                    "lang": "fr",
                                    "theme": "saga-blue"
                                }
                            }
                        ]
                    }
                }
            )
        })

        // We should be logged, and on the reset password form.
        cy.url().should('include', `${Cypress.env('frontend_url')}/reset-password`)
        cy.getCookie('rootdb_session').should('exist')
        cy.contains('Réinitialisation du mot de passe');


        cy.intercept({
            method: 'PUT',
            url: '1', // super-admin user ID = 1 and it's "1" which appears in web-browser console log for this PUT request...
        }).as('apiUser')

        cy.get('input[name=password]').type(Cypress.env('user_super-admin_password'))
        // If no wait here, we have a "websocket not initialized" error...
        cy.wait(1000);
        cy.get('input[name=password2]').type(`${Cypress.env('user_super-admin_password')}{enter}`, {force: true})

        cy.wait('@apiUser').then((interception) => {

            expect(interception?.response?.body).to.deep.equal({
                "status": "Success",
                "title": "Operation finished",
                "message": "The user has been updated.",
                "data": {
                    "firstname": "super-admin",
                    "lastname": "super-admin",
                    "id": 1,
                    "is_active": true,
                    "reset_password": false,
                    "first_connection": false,
                    "name": "super-admin"
                }
            })
        })

        // We should be on the license registration form
        cy.url().should('include', `${Cypress.env('frontend_url')}/setup-licenses`)
        cy.contains('Ajouter une licence');

        // Set an invalid license
        cy.intercept({
            method: 'POST',
            url: '/api/license*', // super-admin user ID = 1 and it's "1" which appears in web-browser console log for this PUT request...
        }).as('apiLicense')

        cy.get('textarea[name=license_key]').type('abcdefjhijklmnopqrstuvwxyz')
        cy.get('button[aria-label=Ajouter]').click();
        cy.wait(250);
        cy.wait('@apiLicense').then((interception) => {

            expect(interception?.response?.body).to.deep.equal(
                {"status": "Error", "title": "Request Error", "message": "License key invalid.", "errors": []}
            )
        })
        cy.contains('License key invalid.');

        // Set a invalid license
        cy.intercept({
            method: 'POST',
            url: '/api/license*', // super-admin user ID = 1 and it's "1" which appears in web-browser console log for this PUT request...
        }).as('apiLicense')

        cy.get('textarea[name=license_key]').clear();
        cy.get('textarea[name=license_key]').type(`${Cypress.env('license_key')}`, {delay: 0})
        cy.get('button[aria-label=Ajouter]').click();
        // Because ton enter licence key, we setup delay = 0 between each characters typed...
        cy.wait(500);
        cy.wait('@apiLicense').then((interception) => {

            expect(interception?.response?.body).to.deep.equal(
                {
                    "status": "Success",
                    "title": "Operation finished",
                    "message": "The license has been created.",
                    "data": {
                        "email": "sebastien.porquet@atomicweb.fr",
                        "for_hostname": "",
                        "is_active": true,
                        "is_valid": true,
                        /* eslint-disable */
                        "license_key": "F8jV1Xu2LyjgtFh0LqOF3zBvQuxD2PDPSyU5iQjHo3Eb7SwvKf1Gwhq3sYSupDwNeuKuKkZg6PUU7KiZo8zlfqq\/gUFp9uUs\/lVX2YAVDNQ9dLi9LW4aQ2toNtc8FHF7+P\/DVG5NTERGtb5rMJdLq10pEkvGhGsw32XYma9vq8+n2\/09VnPv9fRgzxYSXADZAYhlPeitq4rn13aezoDFUJUX4jDO9NWnbF9PA3qd5H4BARwz2IaU5+Bf\/+hLc0J46VTel3CmlqfZ3XlHACFTGLtfMEz\/stinIjY9+M\/7Dc5VgHv6x419FbuCYoO5BbGlqx1R75vRa+1QPSj07OsOEN0JdswfuF5gp\/GiAbylQY9dfxYDw608orRBWao6J\/Cdos9Awv01iSBhVMcUTzYdgc+Lrxtx8s7wJzEj3NLVhtFZm+z+iAjnPxT1Ltaiv7cl7OmG3QDPAkm3xtpo1qy9ft9N7Qd3Zfj4FXlwd\/35j\/6kn+iqG4Y0vKnhGcj1MQoCTHQLX1sT7ObtqESKgS1KXbAQHoDaEj28ctF5HGi2T1EqMSJ526bdiALxEO1UBPaemSrosn6aBf4LSANSbepm0KTUZy4FJclYhEOnX19xuG6yd4TQOxDLtPC\/SueY6GPp0I\/cfjHanuEwecJ6yqoVkmfvl5eHB2X7PE8WOOM0bpsdhw2yOhj91I\/6GeWSAmr4RCa9\/tcvPzdLl+GzDL4iJtBwB1pmA\/F8INCgKVM+uPGXObcssENJoy1AZ4yO4PicDR7i\/5CNX7jZPI9gSjLlbk+RUkjp40yb7cytsnyz3Uuwl2n8W4bV5Kni2IEi\/bIqZEg1\/VsFnk5l6H+s3NrJi\/IlfifIrGQwsiG8OEUFX3CN+XqBdEjvGAciAvQv13EPnmMD+lD6Gjlkxn1o7LW2tqKnXpj4XdUozXfdZwKH6DDtvUyHyd+ULrzkQErvWyAvcRClM1L5lc0t\/qd+fWF78ipKb8hlLZdwyo500JXkIrQVTc9BqMFCI54rEXSLE36ZsZGPXc5Vv7E1irrMlCsa8xP5SJyUOWCFDIRQz6z1m5StdBhIzt2D\/WGU+0AXhY2wj3XlF0Ee5F+C8O2z6kgncQXsbtElttVeiEpTSt2hoYzs6156uaZ2WOMG+n3yWliCOT9AJYSKtYor4h6uh96KPoyGXQ9X11M+FkKwJwEKJSD3UXha372PJGJKU8LbSeywC3ltEoOfxN9Vdo+XC+r2gDbkAWg4B6iNUlnH4Dde6ZgVBH\/Fa62\/fs19JdUapWsJtuYeNRlha\/W3SLhWZhM6v2eD0q8FfWOMbn4P3oA9z\/0AYlGqoOvFEmtwEjtwEFleU2UcH2DInaasxlMuatRy0Q==",
                        "name": "Custom license for testing purpose",
                        "owner": "",
                        "type": "pro",
                        "valid_from": {"date": "2022-11-29 00:00:00.000000", "timezone_type": 3, "timezone": "UTC"},
                        "valid_to": {"date": "2023-11-29 00:00:00.000000", "timezone_type": 3, "timezone": "UTC"},
                        "id": 2
                    }
                }
            )
        })

        cy.contains('Activer celle-ci');
        cy.get('button[aria-label=Valider]').click();

        // We should now be in the main webapp with the Home tab opened.
        cy.url().should('include', `${Cypress.env('frontend_url')}/home`)
        cy.contains('Pas de compte développeur configuré.');
        cy.contains('Pas de compte développeur configuré.');

    })
})


