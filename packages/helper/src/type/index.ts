export type TRemoveCodeBlockOptions = {
  VUE_ENV: 'client' | 'server'
  NODE_ENV?: 'development' | 'production'
}

/**
 * Represents the completion of an asynchronous operation
 */
export interface PromiseTypeEnhance<T, E> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseTypeEnhance<TResult1 | TResult2, E>

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?: ((reason: E) => TResult | PromiseLike<TResult>) | undefined | null
  ): PromiseTypeEnhance<T | TResult, E>
}
