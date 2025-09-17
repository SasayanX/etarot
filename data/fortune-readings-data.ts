// 基本的なカード解釈データ
export function getCardReading(cardId: number, isReversed: boolean, language: string): string {
  // 全22枚の大アルカナの詳細な解釈データ
  const readings: { [key: number]: { upright: { ja: string; en: string }; reversed: { ja: string; en: string } } } = {
    0: {
      upright: {
        ja: "新しい冒険への扉が開かれています。あなたの純粋な心と自由な精神が、これまでにない可能性を引き寄せるでしょう。恐れを手放し、直感を信じて一歩を踏み出してください。予期せぬ出会いや機会が、人生に新たな意味をもたらします。今こそ、既成概念にとらわれない自由な発想で行動する時です。宇宙があなたの勇気ある選択を支援しています。",
        en: "The door to new adventures is opening. Your pure heart and free spirit will attract unprecedented possibilities. Let go of fear, trust your intuition, and take that first step. Unexpected encounters and opportunities will bring new meaning to your life. Now is the time to act with free thinking, unbound by conventional ideas. The universe supports your courageous choices.",
      },
      reversed: {
        ja: "軽率な判断や無計画な行動が、思わぬトラブルを招く可能性があります。現在の状況をより慎重に分析し、十分な準備を整えてから行動することが重要です。周囲の意見に耳を傾け、経験豊富な人からのアドバイスを求めてください。焦りは禁物です。着実な歩みこそが、真の成功への道筋となるでしょう。",
        en: "Rash judgments or unplanned actions may lead to unexpected troubles. It's important to analyze the current situation more carefully and prepare thoroughly before taking action. Listen to others' opinions and seek advice from experienced people. Haste is forbidden. Steady progress will be the path to true success.",
      },
    },
    1: {
      upright: {
        ja: "あなたの内に秘められた創造力と意志の力が、現実を変える時が来ました。四大元素すべてがあなたの味方となり、望む未来を実現するためのエネルギーが満ちています。集中力を高め、明確な目標を設定することで、驚くべき成果を手にすることができるでしょう。今こそ、あなたの真の力を発揮する時です。天と地を結ぶ架け橋として、奇跡を起こす準備が整いました。",
        en: "The time has come for your hidden creativity and willpower to change reality. All four elements are on your side, and energy to realize your desired future is abundant. By enhancing your concentration and setting clear goals, you can achieve remarkable results. Now is the time to demonstrate your true power. As a bridge connecting heaven and earth, you are ready to create miracles.",
      },
      reversed: {
        ja: "能力を過信したり、他者を操作しようとする傾向に注意が必要です。真の力は、誠実さと謙虚さから生まれることを忘れないでください。技術や知識を正しい目的のために使い、周囲との調和を大切にすることが重要です。独断的な判断は避け、協力的な姿勢を心がけましょう。力の濫用は必ず自分に返ってきます。",
        en: "Be careful of tendencies to overestimate your abilities or try to manipulate others. Remember that true power comes from sincerity and humility. It's important to use your skills and knowledge for the right purposes and value harmony with those around you. Avoid arbitrary judgments and maintain a cooperative attitude. Abuse of power will inevitably return to you.",
      },
    },
    2: {
      upright: {
        ja: "内なる知恵と直感が、重要な答えを導いてくれるでしょう。表面的な情報に惑わされることなく、心の奥深くから湧き上がる声に耳を傾けてください。静寂の中で瞑想や内省の時間を持つことで、隠された真実が明らかになります。あなたの潜在意識は、すでに正しい道を知っているのです。月の女神があなたの直感を研ぎ澄ませ、神秘のヴェールを静かに開いてくれるでしょう。",
        en: "Inner wisdom and intuition will guide you to important answers. Don't be misled by superficial information, but listen to the voice rising from deep within your heart. By having time for meditation and introspection in silence, hidden truths will be revealed. Your subconscious already knows the right path. The moon goddess will sharpen your intuition and quietly open the veil of mystery.",
      },
      reversed: {
        ja: "直感を無視して論理だけに頼りすぎている状況があります。感情や潜在意識からのメッセージを軽視せず、バランスの取れた判断を心がけてください。秘密や隠された事実が問題を複雑にしている可能性があります。透明性を重視し、誠実なコミュニケーションを心がけることが解決への鍵となります。",
        en: "There's a situation where you're ignoring intuition and relying too much on logic alone. Don't underestimate messages from emotions and the subconscious, and strive for balanced judgment. Secrets or hidden facts may be complicating problems. The key to resolution is valuing transparency and maintaining sincere communication.",
      },
    },
    3: {
      upright: {
        ja: "豊かさと創造性があなたの人生に満ち溢れています。母なる大地のような包容力と愛情が、周囲の人々に癒しと成長をもたらすでしょう。芸術的な才能や創造的なプロジェクトが花開く時期です。自然との調和を大切にし、美しいものに囲まれることで、さらなるインスピレーションを得ることができます。金星の恵みがあなたの魅力を高め、愛と美の女神があなたを祝福しています。",
        en: "Abundance and creativity are overflowing in your life. Embracing power and love like Mother Earth will bring healing and growth to those around you. It's time for artistic talents and creative projects to bloom. By valuing harmony with nature and surrounding yourself with beautiful things, you can gain further inspiration. Venus's blessings enhance your charm, and the goddess of love and beauty blesses you.",
      },
      reversed: {
        ja: "創造性の停滞や、過保護な態度が問題となっている可能性があります。依存的な関係から脱却し、自立心を育てることが重要です。物質的なことばかりに気を取られず、精神的な豊かさも追求してください。バランスを欠いた愛情表現は、かえって相手の成長を妨げることがあります。",
        en: "Creative stagnation or overprotective attitudes may be causing problems. It's important to break free from dependent relationships and cultivate independence. Don't get caught up only in material things, but also pursue spiritual richness. Unbalanced expressions of love may actually hinder the other person's growth.",
      },
    },
    4: {
      upright: {
        ja: "強固な意志力と統率力によって、安定した基盤を築く時が来ました。リーダーシップを発揮し、責任を持って物事を進めることで、大きな成果を得ることができるでしょう。構造的で論理的なアプローチが成功の鍵となります。権威ある立場の人からの支援も期待できます。火星の力強いエネルギーがあなたの決断力を後押しし、王者の風格を身につけさせてくれるでしょう。",
        en: "The time has come to build a stable foundation through strong willpower and leadership. By demonstrating leadership and proceeding with responsibility, you can achieve great results. A structured and logical approach will be the key to success. Support from people in positions of authority can also be expected. Mars's powerful energy will support your decisiveness and give you the dignity of a ruler.",
      },
      reversed: {
        ja: "独裁的な態度や過度な支配欲が、周囲との摩擦を生んでいる可能性があります。柔軟性を欠いた判断は、かえって状況を悪化させるかもしれません。権威に盲従するのではなく、自分の意見を持つことが大切です。未熟なリーダーシップは問題を引き起こすため、謙虚さを忘れずに行動してください。",
        en: "Dictatorial attitudes or excessive desire for control may be causing friction with those around you. Inflexible judgments may actually worsen the situation. Rather than blindly following authority, it's important to have your own opinions. Immature leadership causes problems, so act without forgetting humility.",
      },
    },
    5: {
      upright: {
        ja: "伝統的な価値観や精神的な指導が、重要な役割を果たす時期です。師匠や先輩からの教えに耳を傾け、学びの姿勢を大切にしてください。宗教的または哲学的な探求が、新たな洞察をもたらすでしょう。社会的な規範や慣習を通じて、深いつながりと安定感を得ることができます。古の叡智があなたを導き、精神的な成長の扉を開いてくれるでしょう。",
        en: "It's a time when traditional values and spiritual guidance play important roles. Listen to teachings from mentors and seniors, and value a learning attitude. Religious or philosophical exploration will bring new insights. Through social norms and customs, you can gain deep connections and a sense of stability. Ancient wisdom will guide you and open the door to spiritual growth.",
      },
      reversed: {
        ja: "既存の権威や伝統に疑問を持ち、独自の道を歩む勇気が必要な時期かもしれません。慣習にとらわれない自由な発想を大切にし、新しい価値観を受け入れることが重要です。反抗的な態度も時には必要ですが、建設的な批判を心がけてください。非伝統的なアプローチが成功をもたらす可能性があります。",
        en: "It may be time to question existing authority and traditions and have the courage to walk your own path. It's important to value free thinking unbound by conventions and accept new values. A rebellious attitude is sometimes necessary, but aim for constructive criticism. Non-traditional approaches may bring success.",
      },
    },
    6: {
      upright: {
        ja: "愛と調和に満ちた美しい関係が築かれる時期です。重要な選択や決断を迫られるかもしれませんが、心の声に従って行動することで、真の幸福を手にすることができるでしょう。パートナーシップにおいて深い絆が生まれ、価値観を共有できる人との出会いが期待できます。双子座の守護のもと、完璧な調和とバランスが実現されるでしょう。",
        en: "It's time for beautiful relationships filled with love and harmony to be built. You may be forced to make important choices or decisions, but by acting according to your heart's voice, you can achieve true happiness. Deep bonds will form in partnerships, and encounters with people who share your values can be expected. Under the protection of Gemini, perfect harmony and balance will be realized.",
      },
      reversed: {
        ja: "人間関係において不調和や価値観の相違が表面化する可能性があります。感情に流されることなく、冷静に状況を分析することが重要です。誤った選択をしないよう、慎重に判断してください。バランスを欠いた関係は見直しが必要かもしれません。自分自身の価値観を明確にすることが先決です。",
        en: "Disharmony and differences in values may surface in relationships. It's important to analyze the situation calmly without being swayed by emotions. Judge carefully to avoid making wrong choices. Unbalanced relationships may need to be reconsidered. Clarifying your own values is the first priority.",
      },
    },
    7: {
      upright: {
        ja: "強い意志力と決意を持って目標に向かって進む時です。困難な状況でも、自己コントロールを保ち、勝利を手にすることができるでしょう。相反する力や感情をうまく統制し、一つの方向に集中することが成功の鍵です。戦車のように力強く前進し、すべての障害を乗り越えてください。蟹座の守護星である月が、あなたの感情をコントロールし、勝利への道を照らしてくれます。",
        en: "It's time to move toward your goals with strong willpower and determination. Even in difficult situations, you can maintain self-control and achieve victory. The key to success is skillfully controlling opposing forces and emotions and concentrating in one direction. Move forward powerfully like a chariot and overcome all obstacles. The moon, Cancer's ruling star, will control your emotions and illuminate the path to victory.",
      },
      reversed: {
        ja: "自己制御を失いやすい状態にあり、感情的な衝動に支配される危険があります。攻撃的になったり、方向性を見失ったりする可能性があります。目標が不明確になっている場合は、一度立ち止まって方向性を見直すことが必要です。冷静さを保ち、計画的に行動することが重要です。",
        en: "You're in a state where you easily lose self-control and risk being dominated by emotional impulses. You may become aggressive or lose direction. If your goals have become unclear, it's necessary to stop once and reconsider your direction. It's important to maintain composure and act systematically.",
      },
    },
    8: {
      upright: {
        ja: "内なる力と勇気を発揮する時が来ました。困難に直面しても、愛と忍耐の力で乗り越えることができるでしょう。暴力的な手段ではなく、優しさと慈悲の心で問題を解決してください。あなたの内に秘められた強さが、周囲の人々にも良い影響を与え、真の勝利をもたらします。獅子座の太陽のエネルギーが、あなたの心に勇気の炎を灯し、どんな困難も乗り越える力を与えてくれるでしょう。",
        en: "The time has come to demonstrate inner strength and courage. Even when facing difficulties, you can overcome them with the power of love and patience. Solve problems with gentleness and compassion, not violent means. The strength hidden within you will also positively influence those around you and bring true victory. Leo's solar energy will light the flame of courage in your heart and give you the power to overcome any difficulty.",
      },
      reversed: {
        ja: "自信を失ったり、内なる力を見失ったりしている状況があります。自己疑念や臆病さに支配されないよう注意してください。小さな一歩から始めて、徐々に自信を取り戻すことが大切です。他者に依存しすぎず、自分自身の力を信じて育てることに焦点を当ててください。",
        en: "There's a situation where you're losing confidence or losing sight of your inner strength. Be careful not to be dominated by self-doubt and cowardice. It's important to start with small steps and gradually regain confidence. Don't depend too much on others, and focus on believing in and developing your own strength.",
      },
    },
    9: {
      upright: {
        ja: "内省と精神的な探求に適した時期です。一人の時間を大切にし、静かな環境で自分自身と向き合ってください。過去の経験から得た知恵を活かし、他者を導く役割を果たすことができるでしょう。孤独を恐れることなく、内なる光を見つけることで、真の理解と悟りに到達できます。乙女座の守護のもと、完璧な自己分析と精神的な成長が実現されるでしょう。",
        en: "It's a time suitable for introspection and spiritual exploration. Value time alone and face yourself in a quiet environment. You can play a role in guiding others by utilizing wisdom gained from past experiences. Without fearing solitude, by finding your inner light, you can reach true understanding and enlightenment. Under Virgo's protection, perfect self-analysis and spiritual growth will be realized.",
      },
      reversed: {
        ja: "孤立感や拒絶感に苦しんでいる可能性があります。引きこもりがちになったり、他者からの助言を拒んだりする傾向があります。未熟な判断をしないよう、信頼できる人の意見に耳を傾けることが大切です。過度な内向きな姿勢は成長を妨げるため、適度な社会的交流も必要です。",
        en: "You may be suffering from feelings of isolation or rejection. You may tend to withdraw or refuse advice from others. It's important to listen to the opinions of trustworthy people to avoid making immature judgments. An excessively inward attitude hinders growth, so moderate social interaction is also necessary.",
      },
    },
    10: {
      upright: {
        ja: "運命的な変化や転機が訪れる重要な時期です。人生の上下動を受け入れ、変化の流れに身を任せてください。幸運な出来事が期待できますが、それは偶然ではなく、これまでの行いの結果です。循環する運命の輪を理解し、今この瞬間を大切にしながら進化し続けてください。木星の拡大と発展のエネルギーが、あなたの人生に新たな章を開いてくれるでしょう。",
        en: "It's an important time when fateful changes and turning points will come. Accept the ups and downs of life and entrust yourself to the flow of change. Fortunate events can be expected, but they are not coincidental but the result of your past actions. Understand the wheel of circulating fate and continue to evolve while cherishing this moment. Jupiter's energy of expansion and development will open a new chapter in your life.",
      },
      reversed: {
        ja: "不運や予期せぬ変化に見舞われる可能性があります。運命に抗おうとせず、状況を受け入れることが重要です。抵抗すればするほど、困難が増す可能性があります。変化を恐れることなく、新しい状況に適応する柔軟性を持ってください。これも成長のための必要な過程なのです。",
        en: "You may be hit by bad luck or unexpected changes. It's important to accept the situation without trying to fight fate. The more you resist, the more difficulties may increase. Don't fear change and have the flexibility to adapt to new situations. This is also a necessary process for growth.",
      },
    },
    11: {
      upright: {
        ja: "公正さと真実が重要な役割を果たす時期です。バランスの取れた判断を心がけ、法的な問題や倫理的な決断に直面した場合は、正義に基づいて行動してください。あなたの行動と結果には明確な因果関係があることを理解し、責任を持って選択することが重要です。天秤座の守護のもと、完璧なバランスと公正な判断が実現されるでしょう。",
        en: "It's a time when fairness and truth play important roles. Strive for balanced judgment, and when facing legal issues or ethical decisions, act based on justice. It's important to understand that there is a clear cause-and-effect relationship between your actions and results, and make choices responsibly. Under Libra's protection, perfect balance and fair judgment will be realized.",
      },
      reversed: {
        ja: "不公平な扱いを受けたり、偏見に基づく判断に遭遇したりする可能性があります。不正義に対しては毅然とした態度を取することが大切です。また、自分自身の判断が偏っていないか見直すことも重要です。バランスを欠いた状況は修正が必要であり、客観的な視点を保つことが求められます。",
        en: "You may receive unfair treatment or encounter judgments based on prejudice. It's important to take a firm stance against injustice. It's also important to review whether your own judgments are biased. Situations lacking balance need correction, and maintaining an objective perspective is required.",
      },
    },
    12: {
      upright: {
        ja: "犠牲や放棄を通じて新たな視点を得る時期です。一時的に待機することや、執着を手放すことが必要かもしれません。異なる角度から物事を見ることで、重要な洞察を得られるでしょう。降伏することは敗北ではなく、より高い理解への道であることを理解してください。海王星の神秘的な力が、あなたの意識を高次元へと導き、真の悟りをもたらしてくれるでしょう。",
        en: "It's time to gain new perspectives through sacrifice and abandonment. You may need to wait temporarily or let go of attachments. By looking at things from different angles, you will gain important insights. Understand that surrender is not defeat, but a path to higher understanding. Neptune's mystical power will guide your consciousness to higher dimensions and bring true enlightenment.",
      },
      reversed: {
        ja: "無駄な努力や執着に囚われている状況があります。抵抗することで状況が悪化する可能性があります。遅延や停滞を感じても、焦らずに時の流れに身を任せることが大切です。また、自己犠牲が過度になっていないか見直し、適切なバランスを見つけることが重要です。",
        en: "There's a situation where you're trapped in wasted efforts or attachments. Resistance may worsen the situation. Even if you feel delays or stagnation, it's important not to rush and entrust yourself to the flow of time. Also, it's important to review whether your self-sacrifice has become excessive and find appropriate balance.",
      },
    },
    13: {
      upright: {
        ja: "重要な終わりと新しい始まりの時期です。古いものが終わることを恐れず、変容のプロセスを受け入れてください。死と再生の象徴的な意味を理解し、根本的な変化を通じて成長することができるでしょう。解放と移行の時期として、この変化を歓迎し、新たな自分に生まれ変わってください。蠍座の変容の力が、あなたの魂を深いレベルで浄化し、真の再生をもたらしてくれるでしょう。",
        en: "It's a time of important endings and new beginnings. Don't fear the end of old things and accept the process of transformation. By understanding the symbolic meaning of death and rebirth, you can grow through fundamental change. Welcome this change as a time of liberation and transition, and be reborn as a new self. Scorpio's transformative power will purify your soul at a deep level and bring true regeneration.",
      },
      reversed: {
        ja: "変化への抵抗や停滞を感じている状況があります。必要な変化を拒絶することで、成長の機会を逃す可能性があります。不完全な変化や中途半端な状態に留まらず、勇気を持って完全な変容を受け入れてください。恐怖に支配されることなく、新しい可能性に心を開くことが重要です。",
        en: "There's a situation where you feel resistance to change or stagnation. By rejecting necessary changes, you may miss opportunities for growth. Don't remain in incomplete changes or half-hearted states, but courageously accept complete transformation. It's important to open your heart to new possibilities without being dominated by fear.",
      },
    },
    14: {
      upright: {
        ja: "バランスと調和を重視する時期です。相反する要素を統合し、中庸の道を歩むことが成功の鍵となります。忍耐強く、穏やかなアプローチで問題に取り組んでください。急激な変化よりも、徐々に調整していくことで、持続可能で安定した結果を得ることができるでしょう。射手座の高次の理想と哲学が、あなたの人生に深い意味と方向性をもたらしてくれるでしょう。",
        en: "It's a time to emphasize balance and harmony. Integrating opposing elements and walking the middle path will be the key to success. Approach problems with patience and a gentle approach. Rather than drastic changes, you will achieve sustainable and stable results by gradually making adjustments. Sagittarius's higher ideals and philosophy will bring deep meaning and direction to your life.",
      },
      reversed: {
        ja: "不均衡や過剰な状態に注意が必要です。極端に走りがちな傾向があるので、中庸を心がけてください。不調和や衝突が起こりやすい状況ですが、冷静さを保ち、バランスを取り戻すことに集中してください。感情的になりすぎず、理性的な判断を心がけることが重要です。",
        en: "You need to be careful of imbalance and excessive states. You tend to go to extremes, so aim for moderation. Disharmony and conflicts are likely to occur, but stay calm and focus on regaining balance. It's important not to become too emotional and strive for rational judgment.",
      },
    },
    15: {
      upright: {
        ja: "束縛や依存の問題に直面する時期です。物質的な欲望や恐怖に基づく選択に注意してください。自分自身を縛る鎖を認識し、それらから解放される方法を見つけることが重要です。誘惑に負けることなく、真の自由を求めて行動してください。現状を変える力はあなたの中にあります。山羊座の試練を通じて、真の強さと自制心を身につけることができるでしょう。",
        en: "It's time to face issues of bondage and dependence. Be careful of choices based on material desires and fears. It's important to recognize the chains that bind you and find ways to free yourself from them. Don't succumb to temptation and act in pursuit of true freedom. The power to change the current situation is within you. Through Capricorn's trials, you can acquire true strength and self-control.",
      },
      reversed: {
        ja: "制限からの解放や独立を達成する時期です。これまであなたを縛っていた鎖から自由になることができるでしょう。力の回復と自己解放のプロセスが始まります。恐怖や依存から脱却し、真の自分を取り戻してください。新しい自由を手にした今、責任を持って行動することが重要です。",
        en: "It's time to achieve liberation from restrictions and independence. You will be able to free yourself from the chains that have bound you. The process of power recovery and self-liberation begins. Break free from fear and dependence and reclaim your true self. Now that you have gained new freedom, it's important to act responsibly.",
      },
    },
    16: {
      upright: {
        ja: "突然の変化や混乱が起こる可能性があります。古い構造や信念の崩壊を恐れず、それによって明らかになる真実を受け入れてください。破壊的に見える出来事も、実は新しい始まりのための必要なプロセスです。啓示を通じて、より深い理解と真の自由に到達することができるでしょう。火星の破壊と再生の力が、偽りの基盤を打ち砕き、真実の光を照らしてくれるでしょう。",
        en: "Sudden changes or chaos may occur. Don't fear the collapse of old structures and beliefs, and accept the truths that are revealed through them. Events that seem destructive are actually necessary processes for new beginnings. Through revelation, you can reach deeper understanding and true freedom. Mars's power of destruction and regeneration will shatter false foundations and illuminate the light of truth.",
      },
      reversed: {
        ja: "災害を回避したり、漸進的な変化を経験したりする可能性があります。恐怖に支配されることなく、変化に対して柔軟に対応してください。急激な変化は避けられましたが、根本的な問題は依然として存在する可能性があります。表面的な安定に満足せず、本質的な改善に取り組むことが重要です。",
        en: "You may avoid disasters or experience gradual changes. Respond flexibly to changes without being dominated by fear. Drastic changes have been avoided, but fundamental problems may still exist. Don't be satisfied with superficial stability, but work on essential improvements.",
      },
    },
    17: {
      upright: {
        ja: "希望とインスピレーションに満ちた時期です。困難な時期の後に訪れる癒しと平静を感じることができます。より良い未来への信頼を持ち、星の導きに従って行動してください。再生と回復のエネルギーがあなたを包み、新たな可能性が開かれるでしょう。直感を信じて、理想に向かって歩んでください。水瓶座の革新的なエネルギーが、あなたの未来に輝かしい希望の光をもたらしてくれるでしょう。",
        en: "It's a time filled with hope and inspiration. You can feel the healing and tranquility that comes after difficult times. Have trust in a better future and act according to the guidance of the stars. The energy of regeneration and recovery will envelop you, and new possibilities will open up. Trust your intuition and walk toward your ideals. Aquarius's innovative energy will bring brilliant light of hope to your future.",
      },
      reversed: {
        ja: "絶望や不信を感じている状況があります。落胆や悲観的な気持ちに支配されないよう注意してください。希望を失わず、小さな光でも見つけることができれば、状況は改善していくでしょう。信頼を取り戻すには時間が必要かもしれませんが、諦めることなく前進し続けてください。",
        en: "There's a situation where you feel despair or distrust. Be careful not to be dominated by discouragement and pessimistic feelings. If you don't lose hope and can find even a small light, the situation will improve. It may take time to regain trust, but continue moving forward without giving up.",
      },
    },
    18: {
      upright: {
        ja: "幻想や不確実性に包まれた時期です。直感を大切にし、潜在意識からのメッセージに注意を払ってください。表面下に隠れた不安や恐怖と向き合う必要があるかもしれません。無意識の世界への旅を通じて、深い洞察と自己理解を得ることができるでしょう。夢や象徴的なメッセージに注目してください。魚座の神秘的な力が、あなたの心の奥底に眠る真実を浮上させてくれるでしょう。",
        en: "It's a time enveloped in illusions and uncertainty. Value your intuition and pay attention to messages from your subconscious. You may need to face anxieties and fears hidden beneath the surface. Through a journey into the unconscious world, you can gain deep insights and self-understanding. Pay attention to dreams and symbolic messages. Pisces's mystical power will bring the truth sleeping in the depths of your heart to the surface.",
      },
      reversed: {
        ja: "恐怖の解消や明晰さの回復を経験する時期です。混乱が終わり、真実が明らかになる時が来ました。これまで隠されていたことが露呈し、状況がより明確になります。不安や恐れから解放され、現実をより正確に認識できるようになるでしょう。新しい明晰さを持って前進してください。",
        en: "It's time to experience the resolution of fears and the recovery of clarity. The time has come for confusion to end and truth to be revealed. Things that have been hidden will be exposed, and the situation will become clearer. You will be freed from anxiety and fear and be able to perceive reality more accurately. Move forward with new clarity.",
      },
    },
    19: {
      upright: {
        ja: "喜びと成功に満ちた輝かしい時期です。明るい光と温かさがもたらす生命力を感じ、純粋な幸福を体験してください。活力に満ち、明晰な思考で真実を見抜くことができます。楽観的な気持ちで、すべてのことが良い方向に向かっていることを信じてください。成功と達成の時が訪れています。太陽の無限のエネルギーが、あなたの人生を光で満たし、すべての影を払拭してくれるでしょう。",
        en: "It's a brilliant time filled with joy and success. Feel the vitality brought by bright light and warmth, and experience pure happiness. You are full of vitality and can see through the truth with clear thinking. With an optimistic feeling, believe that everything is heading in a good direction. The time of success and achievement has arrived. The sun's infinite energy will fill your life with light and dispel all shadows.",
      },
      reversed: {
        ja: "過度な楽観主義や幻滅に注意が必要です。一時的な喜びに惑わされず、現実的な視点を保つことが大切です。表面的な成功に満足せず、より深い充実感を求めてください。また、エネルギーの浪費にも気をつけ、持続可能な幸福を追求することが重要です。",
        en: "You need to be careful of excessive optimism and disillusionment. Don't be misled by temporary joy and maintain a realistic perspective. Don't be satisfied with superficial success, but seek deeper fulfillment. Also, be careful of wasting energy and pursue sustainable happiness.",
      },
    },
    20: {
      upright: {
        ja: "再生と重要な決断の時期です。過去の経験から学び、新たな段階へと移行する転機を迎えています。内なる呼びかけに耳を傾け、目覚めの時を迎えてください。解放と新しい始まりのエネルギーが、あなたの人生に大きな変化をもたらすでしょう。真の自分として生まれ変わる時が来ました。冥王星の変容の力が、あなたの魂を根本から変革し、新しい人生の扉を開いてくれるでしょう。",
        en: "It's a time of rebirth and important decisions. You are at a turning point where you learn from past experiences and transition to a new stage. Listen to your inner calling and welcome the time of awakening. The energy of liberation and new beginnings will bring great changes to your life. The time has come to be reborn as your true self. Pluto's transformative power will fundamentally transform your soul and open the door to a new life.",
      },
      reversed: {
        ja: "自己疑念や判断の誤りに注意が必要です。重要な決断を先延ばしにしたり、過去の失敗に囚われたりする傾向があります。後悔に支配されず、前向きな選択をすることが大切です。拒絶や否定的な態度は成長を妨げるため、開放的な心を持つことが重要です。",
        en: "You need to be careful of self-doubt and misjudgment. You tend to postpone important decisions or be trapped by past failures. It's important not to be dominated by regret and make positive choices. Rejection and negative attitudes hinder growth, so it's important to have an open heart.",
      },
    },
    21: {
      upright: {
        ja: "完成と達成の時期です。長い旅路の終わりと新たな始まりを同時に体験するでしょう。統合と全体性の感覚を得て、深い充実感に満たされます。あなたの努力が実を結び、目標が達成される時です。世界全体との調和を感じ、次のサイクルへの準備を始めてください。土星の完成と達成の力が、あなたの人生に永続的な成功と満足をもたらしてくれるでしょう。",
        en: "It's a time of completion and achievement. You will simultaneously experience the end of a long journey and a new beginning. You will gain a sense of integration and wholeness and be filled with deep fulfillment. It's time for your efforts to bear fruit and goals to be achieved. Feel harmony with the entire world and begin preparing for the next cycle. Saturn's power of completion and achievement will bring lasting success and satisfaction to your life.",
      },
      reversed: {
        ja: "未完成や停滞を感じる状況があります。目標の未達成や閉鎖的な態度が問題となる可能性があります。完璧を求めすぎず、現在の状況を受け入れることが大切です。また、新しい挑戦への準備が整っていない可能性もあります。焦らず、着実に準備を進めることが重要です。",
        en: "There's a situation where you feel incompleteness or stagnation. Unachieved goals or closed attitudes may become problems. Don't seek perfection too much and accept the current situation. Also, you may not be ready for new challenges. It's important not to rush and steadily make preparations.",
      },
    },
  }

  // 既存のデータを確認
  if (readings[cardId]) {
    const reading = readings[cardId]
    if (isReversed) {
      return language === "en" ? reading.reversed.en : reading.reversed.ja
    } else {
      return language === "en" ? reading.upright.en : reading.upright.ja
    }
  }

  // フォールバック：基本的な解釈
  return isReversed
    ? language === "en"
      ? "You may face difficulties today, but you have the strength to overcome them. Trust in your inner wisdom and take things one step at a time."
      : "今日は困難に直面するかもしれませんが、それを乗り越える力があります。内なる知恵を信じ、一歩ずつ進んでいきましょう。"
    : language === "en"
      ? "Today will be a day of new discoveries and insights. Stay open to possibilities and trust your intuition to guide you forward."
      : "今日は新たな発見や気づきがある日になるでしょう。可能性に心を開き、直感を信じて前進してください。"
}

// 恋愛占いの解釈を取得する関数
export function getLoveReading(cardId: number, position: string, isReversed: boolean, language: string): string {
  // Fix position key mapping
  let positionKey: string
  if (position.includes("過去") || position.includes("Past")) {
    positionKey = "past"
  } else if (position.includes("現在") || position.includes("Present")) {
    positionKey = "present"
  } else if (position.includes("未来") || position.includes("Future")) {
    positionKey = "future"
  } else {
    // Default fallback based on common position names
    positionKey = "present"
  }

  // フォールバック：基本的な解釈を使用
  const baseReading = getCardReading(cardId, isReversed, language)
  const positionPrefix = language === "en" ? `In ${position.toLowerCase()}: ` : `${position}において：`
  return positionPrefix + baseReading
}

// 仕事占いの解釈を取得する関数
export function getCareerReading(cardId: number, position: string, isReversed: boolean, language: string): string {
  // Fix position key mapping
  let positionKey: string
  if (position.includes("現在") || position.includes("Current")) {
    positionKey = "current"
  } else if (position.includes("課題") || position.includes("Challenge")) {
    positionKey = "challenge"
  } else if (position.includes("アドバイス") || position.includes("Advice")) {
    positionKey = "advice"
  } else {
    // Default fallback based on common position names
    positionKey = "current"
  }

  // フォールバック：基本的な解釈を使用
  const baseReading = getCardReading(cardId, isReversed, language)
  const positionPrefix = language === "en" ? `In ${position.toLowerCase()}: ` : `${position}において：`
  return positionPrefix + baseReading
}

// 金運占いの解釈を取得する関数
export function getMoneyReading(cardId: number, position: string, isReversed: boolean, language: string): string {
  // Fix position key mapping
  let positionKey: string
  if (position.includes("現在") || position.includes("Current")) {
    positionKey = "current"
  } else if (position.includes("課題") || position.includes("Challenge")) {
    positionKey = "challenge"
  } else if (position.includes("アドバイス") || position.includes("Advice")) {
    positionKey = "advice"
  } else {
    // Default fallback based on common position names
    positionKey = "current"
  }

  // フォールバック：基本的な解釈を使用
  const baseReading = getCardReading(cardId, isReversed, language)
  const positionPrefix = language === "en" ? `In ${position.toLowerCase()}: ` : `${position}において：`
  return positionPrefix + baseReading
}

// 決断占いの解釈を取得する関数
export function getDecisionReading(cardId: number, position: string, isReversed: boolean, language: string): string {
  // Fix position key mapping
  let positionKey: string
  if (position.includes("選択肢A") || position.includes("Option A")) {
    positionKey = "optionA"
  } else if (position.includes("選択肢B") || position.includes("Option B")) {
    positionKey = "optionB"
  } else {
    // Default fallback based on common position names
    positionKey = "optionA"
  }

  // フォールバック：基本的な解釈を使用
  const baseReading = getCardReading(cardId, isReversed, language)
  const positionPrefix = language === "en" ? `For ${position.toLowerCase()}: ` : `${position}について：`
  return positionPrefix + baseReading
}
