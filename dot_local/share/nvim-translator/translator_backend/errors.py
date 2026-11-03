"""Only these intentionally static messages cross the process boundary."""


class BackendError(Exception):
    """An actionable, credential-safe error suitable for the UI."""
