import crypto from 'crypto'

type TDingDingRobot = {
  name: string
  secret: string
}

type TAt = { atMobiles?: string[]; isAtAll?: boolean }
type TLink = {
  /**
   * 标题
   */
  title: string

  /**
   * 消息内容
   */
  text: string

  /**
   * 跳转的Url
   */
  messageUrl: string

  /**
   * 图片的链接
   */
  picUrl?: string
}

type TActionCard = {
  /**
   * 标题
   */
  title: string

  /**
   * 消息内容
   */
  text: string

  /**
   * 隐藏发送者头像(1隐藏，0显示，默认为0)
   */
  hideAvatar?: number

  /**
   * 隐藏发送者头像(1隐藏，0显示，默认为0)
   */
  btnOrientation?: number

  /**
   * 按钮排列的方向(0竖直，1横向，默认为0)
   */
  btns?: Array<{
    /**
     * 按钮标题
     */
    title: string

    /**
     * 按钮链接
     */
    actionURL: string
  }>
}

export class DingDingRobot {
  name: string

  protected secret: string

  constructor({ name, secret }: TDingDingRobot) {
    this.name = name
    this.secret = secret
  }

  createSignature() {
    const timestamp = Date.now()
    const sign = crypto
      .createHmac('sha256', this.secret)
      .update(`${timestamp}\n${this.secret}`)
      .digest()
      .toString('base64')
    return {
      timestamp,
      sign: encodeURIComponent(sign)
    }
  }

  /**
   * 发送纯文本消息，支持@群内成员
   *
   * @param content 消息内容
   */
  text(content: string, at: TAt = {}) {
    return {
      msgtype: 'text',
      text: {
        content
      },
      at
    }
  }

  /**
   * 发送单个图文链接
   */
  link(link: TLink) {
    return {
      msgtype: 'link',
      link
    }
  }

  /**
   * 发送Markdown消息
   *
   * @param title 标题
   * @param text 消息内容(支持Markdown)
   */
  markdown(title: string, text: string, at: TAt = {}) {
    return {
      msgtype: 'markdown',
      markdown: {
        title,
        text
      },
      at
    }
  }

  /**
   * 发送actionCard(动作卡片)
   * - 支持多个按钮，支持Markdown
   */
  actionCard(card: TActionCard) {
    return {
      msgtype: 'actionCard',
      actionCard: {
        title: card.title,
        text: card.text,
        hideAvatar: card.hideAvatar || 1,
        btnOrientation: card.btnOrientation || 0,
        btns: card.btns || []
      }
    }
  }

  /**
   * 发送feedCard，支持多图文链接
   * - links可包含多个link，建议不要超过4个
   */
  feedCard(links: TLink[]) {
    return {
      msgtype: 'feedCard',
      feedCard: {
        links
      }
    }
  }
}
