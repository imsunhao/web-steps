/**
 * Test Store
 */
declare namespace TestStore {
  /**
   * vuex state
   */
  export interface State {
    /**
     * 单元测试使用
     */
    test: {
      test: string
      testNumber: number
      deepTest: {
        test1: string
        test2: number
      }
    }
  }

  /**
   * vuex getters
   */
  export interface Getters {
    globleValue: number
    /**
     * 单元测试使用
     */
    test?: {
      getTest: string
      getTestNumber: number
      deepTest?: {
        getTest: string
        getTestNumber: number
      }
    }
  }
}

export = TestStore
