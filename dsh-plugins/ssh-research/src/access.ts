import type { IncomingMessage } from 'node:http'

/** The small public Connection surface used by raw HTTP and upgrade routes. */
export interface ConnectionAdmissionService {
  admit(req: IncomingMessage):
    | { readonly rejection: 401 | 403 }
    | { readonly peer: { readonly principal: { readonly kind: string }; readonly signal?: AbortSignal } }
}

/** Delegate trust, Host/Origin and cookie authentication to the Host. Never fall back to IP trust. */
export function ownerRejection(getConnection: () => ConnectionAdmissionService | undefined, req: IncomingMessage): 401 | 403 | 503 | undefined {
  try {
    const connection = getConnection()
    if (connection === undefined || typeof connection.admit !== 'function') return 503
    const admission = connection.admit(req)
    if ('rejection' in admission) return admission.rejection === 401 ? 401 : 403
    if (admission.peer.principal.kind !== 'owner' || admission.peer.signal?.aborted === true) return 403
    return undefined
  } catch {
    return 503
  }
}
