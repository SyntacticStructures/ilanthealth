class MissingEnvironmentVariable(Exception):
    def __init__(self, key):
        self.message = "{key} is missing in the environment variables".format(key=key)
        super().__init__(self.message)
