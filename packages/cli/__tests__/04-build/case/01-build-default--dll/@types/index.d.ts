declare namespace WebSteps {
  type ErrorMessage = { code: number; code_description: string; message: string; field: string; field_key: string }
  type APIError = {
    messages: ErrorMessage[]
    code: number
  }
  type APITest = {
    test: 'get' | 'post'
  }
}

export = WebSteps
