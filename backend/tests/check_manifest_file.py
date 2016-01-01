import yaml


def load_manifest():
    with open("app.yaml") as app_yaml:
        as_dict = yaml.safe_load(app_yaml)
        return as_dict


# checks
def handlers_are_secure(manifest):
    """Check that all handlers have truthy property 'secure'
    Takes: manifest file as dict
    Returns: True is all have truthy prop secure and false otherwise
    """
    handlers = manifest["handlers"]
    for handler in handlers:
        # has prop secure and prop secure truthy
        if "secure" in handler and handler["secure"]:
            pass  # all is good with this handler
        else:
            return False  # at least one handler is not secure

    return True  # if we get to here every handler is secure


def do_checks():
    ALL_CHECKS = [handlers_are_secure]
    MANIFEST = load_manifest()
    passes = []
    fails = []

    for check in ALL_CHECKS:
        result = check(MANIFEST)
        check_name = check.__name__
        if result:
            passes.append(check_name)
        else:
            fails.append(check_name)

    return passes, fails


def main():
    passes, fails = do_checks()
    if not fails:
        print("All manifest file checks succeeded")
    else:
        print("Succeeded manifest file checks:", ", ".join(passes))
        raise Exception("Failed manifest file checks:" + ", ".join(fails))

if __name__ == "__main__":
    main()
