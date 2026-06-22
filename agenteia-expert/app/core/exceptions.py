class AgenteIAError(Exception):
    """Base domain error."""


class EntityNotFoundError(AgenteIAError):
    """Requested domain entity does not exist."""


class ToolPermissionDeniedError(AgenteIAError):
    """Tool policy rejected an execution request."""


class ToolApprovalRequiredError(AgenteIAError):
    """A human approval is required before execution."""


class ExternalServiceUnavailableError(AgenteIAError):
    """External provider failed or timed out."""
