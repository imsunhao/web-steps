import ApiActor from './base-actor'
import { APITest } from '../../@types'


class TestApiActor extends ApiActor<APITest> {
  getTest(payload = {}) {
    return this.get(payload)
  }

  create(payload = {}) {
    return this.post(payload)
  }
}

export const testApi = new TestApiActor('test')
