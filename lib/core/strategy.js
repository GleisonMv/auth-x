/**
 * The basis of strategy, extend your strategy with this class
 *
 * Sample:
 *
 * class MyStrategy extends Strategy {
 *
 *   onError(request, reply, error){
 *      reply.send({
 *         success: false,
 *        error: error
 *      })
 *    }
 *
 *    onUserCheck(request, done){
 *        //....
 *       done(null, true)
 *   }
 * }
 *
 * module.exports = MyStrategy
*/
class Strategy {
  /**
     * On Error (Required)
     *
     * @param Fastify.Request request
     * @param Fastify.Reply reply
     * @param Number error
     */
  onError (request, reply, error) {
    throw new Error('You have to implement the method onError!')
  }

  /**
     * On check user (Required)
     *
     * @param Fastify.Request request
     * @param function(Error, Boolean) done
     */
  onUserCheck (request, callback) {
    throw new Error('You have to implement the method onUserCheck!')
  }

  /**
   * On the permission check (Optional)
   *
   * @param Fastify.Request request
   * @param {*} permission
   * @param function(Error, Boolean) done
   */
  onPermissionCheck (request, permission, done) {
    done(null, true)
  }
}

module.exports = Strategy
