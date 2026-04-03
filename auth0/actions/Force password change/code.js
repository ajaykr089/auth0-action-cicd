/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/

/**
 * Deplying locally first
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.connection.strategy !== "auth0") return;

  if (event.request.query?.prompt?.includes("none")) return;

  if (event.transaction?.protocol === "oauth2-refresh-token") return;

  const allowedApps = [
    "uCSJoGEvmQh6dbKxfR0xP7kSm3Cnj2fd",
    "wWVjPpjxrNj5HADnQoQThAAKaTX0glNw"
  ];

  if (!allowedApps.includes(event.client.client_id)) return;

  let forceChange = event.user.app_metadata?.force_password_change;

  /**
   * Only enforce if flag is already set
   */
  if (!forceChange) return;

  api.idToken.setCustomClaim(
    "http://localhost:5174/force_password_change",
    true
  );

  api.accessToken.setCustomClaim(
    "http://localhost:5174/force_password_change",
    true
  );
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
