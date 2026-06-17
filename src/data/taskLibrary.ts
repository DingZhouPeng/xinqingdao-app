import type { WuyuTask } from '../types';

export const taskLibrary: WuyuTask[] = [
  {
    id: 'body-breath-60',
    category: '体',
    title: '一分钟方块呼吸',
    detail: '吸气 4 秒，停顿 4 秒，呼气 4 秒，停顿 4 秒，循环 4 次。',
    mood: 'nervous',
    principle: '放松训练'
  },
  {
    id: 'mind-study-3',
    category: '智',
    title: '列出 3 个复习重点',
    detail: '只写现在最需要复习的 3 个小知识点，不要求一次解决全部。',
    scene: 'study',
    principle: '问题拆解'
  },
  {
    id: 'labor-desk-3',
    category: '劳',
    title: '整理桌面 3 分钟',
    detail: '只整理眼前的一小块桌面，给大脑一个清爽开始。',
    principle: '行为激活'
  },
  {
    id: 'moral-i-message',
    category: '德',
    title: '不伤人表达句式',
    detail: '用“我感到……因为……我希望……”表达，而不是直接指责。',
    scene: 'friends',
    principle: '情绪表达与同理沟通'
  },
  {
    id: 'body-pause-90',
    category: '体',
    title: '生气暂停 90 秒',
    detail: '先把手机放下，喝一口水，90 秒后再决定要不要回复。',
    mood: 'angry',
    principle: '冲动暂停'
  },
  {
    id: 'art-weather-draw',
    category: '美',
    title: '画一张心情天气图',
    detail: '用颜色画出今天的天气，不需要画得好，只要表达出来。',
    principle: '艺术表达'
  },
  {
    id: 'moral-thanks',
    category: '德',
    title: '写一句感谢',
    detail: '给最近帮助过你的人写一句感谢，可以先存在 APP 里。',
    principle: '积极心理学'
  },
  {
    id: 'mind-reframe',
    category: '智',
    title: '把“我不行”改成下一步',
    detail: '把评价自己的话改写成一个能行动的小步骤。',
    scene: 'self',
    principle: '认知重评'
  },
  {
    id: 'labor-bag',
    category: '劳',
    title: '收拾书包一个分区',
    detail: '只整理书包里一个分区，用小行动找回掌控感。',
    principle: '掌控感建立'
  },
  {
    id: 'body-walk',
    category: '体',
    title: '走到窗边或走廊 2 分钟',
    detail: '轻轻活动肩颈，看看远处，让身体从紧绷中松一点。',
    principle: '身体调节'
  },
  {
    id: 'art-music',
    category: '美',
    title: '选一首安静音乐',
    detail: '选择一首让你慢下来的音乐，听完前不做评价。',
    principle: '感官调节'
  },
  {
    id: 'moral-help-script',
    category: '德',
    title: '向可信任的人开口',
    detail: '复制一句话：“我现在有点难受，能不能陪我待一会儿？”',
    principle: '社会支持'
  }
];
