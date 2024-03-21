describe.only('super-admin login & license registration', () => {

    it('Invalid password provided', () => {

        cy.exec('docker exec -u rootdb dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api  < /home/share/Developments/spo-ijaz/rootdb/api/storage/app/seeders/production/seeder_init.sql')
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

        cy.exec('docker exec -u rootdb dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api  < /home/share/Developments/spo-ijaz/rootdb/api/storage/app/seeders/production/seeder_init.sql')
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

        // We should now be in the main webapp with the Home tab opened.
        cy.url().should('include', `${Cypress.env('frontend_url')}/home`)
        cy.contains('Pas de compte développeur configuré.');
        cy.contains('Pas de compte développeur configuré.');

    })
})


