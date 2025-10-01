/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| Le HTTP kernel enregistre les middlewares globaux et les routes du serveur.
|
*/

import server from '@adonisjs/core/services/server'
import router from '@adonisjs/core/services/router'

/**
 * Gestion des erreurs
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * Middleware global pour toutes les requêtes HTTP
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/core/bodyparser_middleware'),
])

/**
 * Named middleware collection
 */
export const middleware = router.named({})
