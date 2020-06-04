/* eslint-disable @typescript-eslint/no-namespace */
import { createRequestHelper, SERVER_ROUTER_METHOD } from '@web-steps/helper-api'
import { AxiosRequestConfig } from 'axios'

namespace Api {
  export type User = {
    login: {
      req: Pick<Schema.User, 'ID' | 'password'>
      res: Omit<Schema.User, 'password'>
    }
    logout: any
  }
}

namespace Schema {
  export type User = {
    ID: string
    name: string
    password: string
  }
}

function createTools() {
  const { createRouterHelper, createAxiosHelper } = createRequestHelper({
    api: {
      children: {
        user: {
          children: {
            login: {
              method: SERVER_ROUTER_METHOD.POST
            },
            logout: {
              method: SERVER_ROUTER_METHOD.POST
            }
          }
        }
      }
    }
  })
  const router: any = createMockRouter('/api/user')
  const axios: any = createMockAxios(router)
  const routerHelper = createRouterHelper<Api.User>(router, 'api', 'user')
  const userApi = createAxiosHelper<Api.User>(axios, 'api', 'user')
  return {
    routerHelper,
    userApi
  }
}

describe('Api', () => {
  const USERID: Schema.User['ID'] = 'ID'
  const USERNAME: Schema.User['name'] = 'username'
  const PASSWORD: Schema.User['password'] = 'password'
  const ERRORCODE = 1

  it(
    'login success',
    done => {
      const { routerHelper, userApi } = createTools()
      routerHelper.use('login', (req, res) => {
        res.json({
          ID: req.body.ID,
          name: USERNAME
        })
      })
      userApi('login', {
        data: {
          ID: USERID,
          password: PASSWORD
        }
      })
        .then(({ data }) => {
          expect(data.name).toEqual(USERNAME)
          expect(data.ID).toEqual(USERID)
          done()
        })
        .catch(e => {
          e.response.data.code
        })

      // userApi.logout({})
    },
    3000
  )

  it(
    'login fail',
    done => {
      const { routerHelper, userApi } = createTools()
      routerHelper.use('login', (req, res) => {
        res.status(400).json({ code: 1 })
      })
      userApi('login', {
        data: {
          ID: USERID,
          password: PASSWORD
        }
      }).catch(err => {
        expect(err.response.data.code).toEqual(ERRORCODE)
        done()
      })
    },
    3000
  )
})

function createReq(options: AxiosRequestConfig) {
  return {
    params: options.params,
    body: options.data
  }
}

function createRes(resove: any, reject: any) {
  return {
    json(data: any) {
      return resove({ data })
    },
    status(code: number) {
      return {
        json(data: any) {
          return code < 300 ? resove({ data }) : reject({ response: { data } })
        }
      }
    }
  }
}

function createMockAxios(router: any) {
  const axios: any = function(options: AxiosRequestConfig) {
    return axios[options.method](options)
  }
  function use(path: string, func: (...args: any) => void) {
    router[path] = func
  }
  function get(options: AxiosRequestConfig) {
    let resove: any, reject: any
    const promise = new Promise((r, j) => ((resove = r), (reject = j)))
    router.get[options.url](createReq(options), createRes(resove, reject))
    return promise
  }
  function post(options: AxiosRequestConfig) {
    let resove: any, reject: any
    const promise = new Promise((r, j) => ((resove = r), (reject = j)))
    router.post[options.url](createReq(options), createRes(resove, reject))
    return promise
  }
  axios.use = use
  axios.get = get
  axios.post = post
  return axios
}

function createMockRouter(basePath: string) {
  const router: any = {
    get: {},
    post: {}
  }
  function use(path: string, func: (...args: any) => void) {
    router[basePath + path] = func
  }
  function get(path: string, func: (...args: any) => void) {
    router.get[basePath + path] = func
  }
  function post(path: string, func: (...args: any) => void) {
    router.post[basePath + path] = func
  }
  router.use = use
  router.get = get
  router.post = post
  return router
}
