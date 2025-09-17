// カードの説明を取得する関数
export function getCardDescription(cardId: number, language = "ja"): string {
  // 大アルカナ（0-21）
  if (cardId >= 0 && cardId <= 21) {
    const descriptionsJa = [
      "新しい旅の始まり、無邪気さ、自由な精神を表します。未知の可能性に満ちた冒険に踏み出す勇気と、慣習にとらわれない自由な発想を象徴しています。",
      "創造力、意志力、熟練した技術を表します。自分の持つ能力や資源を最大限に活用して、アイデアを現実化する力を象徴しています。",
      "直感、無意識、内なる知恵を表します。表面的なものを超えた深い理解と、静かな内省を通じて得られる洞察力を象徴しています。",
      "豊かさ、創造性、母性を表します。自然の恵みや豊穣、育む力、そして美と感性の豊かさを象徴しています。",
      "権威、構造、秩序を表します。リーダーシップと安定した基盤を築く力、そして理性的な判断力を象徴しています。",
      "伝統、信念、教育を表します。精神的な指導や伝統的な価値観、そして社会的な規範や儀式を象徴しています。",
      "愛、調和、関係性を表します。深い絆や選択、そして自己と他者との統合を象徴しています。",
      "意志力、決意、勝利を表します。困難を乗り越えて前進する力と、相反する力をコントロールする能力を象徴しています。",
      "内なる力、勇気、忍耐を表します。暴力ではなく愛と忍耐によって困難を克服する力を象徴しています。",
      "内省、孤独、指導を表します。静かな瞑想と自己探求を通じて得られる知恵と、その光で他者を導く役割を象徴しています。",
      "運命、循環、転機を表します。人生の上下動と、避けられない変化の流れを象徴しています。",
      "公正、真実、法を表します。バランスのとれた判断と、行動と結果の因果関係を象徴しています。",
      "犠牲、放棄、新たな視点を表します。執着を手放し、異なる角度から物事を見ることで得られる洞察を象徴しています。",
      "終わりと始まり、変容、解放を表します。古いものが終わり新しいものが始まる自然な循環と、根本的な変化を象徴しています。",
      "バランス、調和、中庸を表します。相反する要素を統合し、穏やかに流れる調和のとれた状態を象徴しています。",
      "束縛、依存、物質主義を表します。自分自身を縛る鎖と、欲望や恐怖に基づく選択を象徴しています。",
      "突然の変化、混乱、啓示を表します。古い構造や信念の崩壊と、それによってもたらされる真実の露呈を象徴しています。",
      "希望、インスピレーション、平静を表します。困難な時期の後に訪れる癒しと、より良い未来への信頼を象徴しています。",
      "幻想、不確実性、直感を表します。表面下に隠れた不安や恐怖と、無意識の世界への旅を象徴しています。",
      "喜び、成功、活力を表します。明るい光と温かさがもたらす生命力と、純粋な幸福を象徴しています。",
      "再生、決断、呼びかけを表します。過去の経験から学び、新たな段階へと移行する重要な転機を象徴しています。",
      "完成、統合、達成を表します。旅の終わりと新たな始まり、そして全体性の感覚を象徴しています。",
    ]

    const descriptionsEn = [
      "Represents the beginning of a new journey. It symbolizes innocence, freedom, adventurous spirit, and the courage to take the first step into the unknown.",
      "Represents creativity, willpower, and skilled technique. Symbolizes the power to maximize one's abilities and resources to turn ideas into reality.",
      "Represents intuition, the unconscious, and inner wisdom. Symbolizes deep understanding beyond the superficial and insight gained through quiet introspection.",
      "Represents abundance, creativity, and motherhood. Symbolizes nature's blessings, fertility, nurturing power, and the richness of beauty and sensitivity.",
      "Represents authority, structure, and order. Symbolizes leadership, the power to build a stable foundation, and rational judgment.",
      "Represents tradition, belief, and education. Symbolizes spiritual guidance, traditional values, and social norms and rituals.",
      "Represents love, harmony, and relationships. Symbolizes deep bonds, choices, and the integration of self and others.",
      "Represents willpower, determination, and victory. Symbolizes the power to overcome difficulties and move forward, and the ability to control opposing forces.",
      "Represents inner strength, courage, and patience. Symbolizes the power to overcome difficulties through love and patience rather than violence.",
      "Represents introspection, solitude, and guidance. Symbolizes wisdom gained through quiet meditation and self-exploration, and the role of guiding others with that light.",
      "Represents destiny, cycles, and turning points. Symbolizes life's ups and downs and the inevitable flow of change.",
      "Represents justice, truth, and law. Symbolizes balanced judgment and the cause-and-effect relationship between actions and results.",
      "Represents sacrifice, abandonment, and new perspectives. Symbolizes the insight gained by letting go of attachments and seeing things from different angles.",
      "Represents endings and beginnings, transformation, and liberation. Symbolizes the natural cycle of old things ending and new things beginning, and fundamental change.",
      "Represents balance, harmony, and moderation. Symbolizes the integration of opposing elements and a harmonious state of gentle flow.",
      "Represents bondage, dependence, and materialism. Symbolizes the chains that bind oneself and choices based on desire and fear.",
      "Represents sudden change, chaos, and revelation. Symbolizes the collapse of old structures and beliefs and the revelation of truth that brings.",
      "Represents hope, inspiration, and tranquility. Symbolizes healing that comes after difficult times and trust in a better future.",
      "Represents illusion, uncertainty, and intuition. Symbolizes hidden anxieties and fears beneath the surface and journeys into the unconscious world.",
      "Represents joy, success, and vitality. Symbolizes the life force brought by bright light and warmth, and pure happiness.",
      "Represents rebirth, decision, and calling. Symbolizes learning from past experiences and important turning points for transitioning to new stages.",
      "Represents completion, integration, and achievement. Symbolizes the end of a journey and new beginnings, and a sense of wholeness.",
    ]

    const descriptions = language === "en" ? descriptionsEn : descriptionsJa
    return descriptions[cardId] || (language === "en" ? "Description not found" : "説明が見つかりません")
  }

  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsDescriptionsJa = [
      "創造性、情熱、新しいプロジェクトの始まりを表します。新たな可能性やチャンスの到来を示唆し、エネルギーに満ちた出発点を象徴しています。", // エース
      "計画、決断、将来の展望を表します。より広い世界への視野と、次のステップを決める重要な選択を象徴しています。", // 2
      "拡大、成長、長期的な視野を表します。これまでの努力が実を結び始め、より広い可能性が開けていく様子を象徴しています。", // 3
      "祝福、調和、家庭の安定を表します。目標達成の喜びと、共同体や家族との絆を祝う瞬間を象徴しています。", // 4
      "競争、衝突、多様性を表します。異なる意見や目標が衝突し、創造的な緊張や成長のための挑戦を生み出す状況を象徴しています。", // 5
      "勝利、認識、自信を表します。努力が報われ、周囲から認められる成功と、それによって得られる自信を象徴しています。", // 6
      "防御、忍耐、挑戦を表します。獲得した立場を守るための闘争と、逆境に立ち向かう勇気を象徴しています。", // 7
      "速度、行動、進歩を表します。物事が急速に進展し、エネルギーが一方向に集中している状態を象徴しています。", // 8
      "忍耐、持続力、最後の試練を表します。多くの困難を乗り越えてきた後の最後の挑戦と、それに立ち向かう強さを象徴しています。", // 9
      "重荷、責任、達成を表します。成功によってもたらされた多くの責任と、それを背負う重圧を象徴しています。", // 10
      "探検、熱意、発見を表します。新しいアイデアや冒険に対する純粋な情熱と、可能性を探求する好奇心を象徴しています。", // ページ
      "エネルギー、情熱、行動を表します。冒険心と自信に満ちた行動力、そして新しい挑戦に向かう勢いを象徴しています。", // ナイト
      "情熱、決断力、自信を表します。魅力的なカリスマ性と、自分の目標に向かって進む強い意志を象徴しています。", // クイーン
      "ビジョン、リーダーシップ、名誉を表します。創造的なエネルギーを実践的な行動に変換し、他者を導く力を象徴しています。", // キング
    ]

    const wandsDescriptionsEn = [
      "Represents creativity, passion, and the beginning of new projects. It suggests the arrival of new possibilities and opportunities, symbolizing an energetic starting point.", // Ace
      "Represents planning, decision-making, and future prospects. It symbolizes a broader worldview and important choices that determine the next steps.", // 2
      "Represents expansion, growth, and long-term vision. It symbolizes how past efforts are beginning to bear fruit and broader possibilities are opening up.", // 3
      "Represents celebration, harmony, and domestic stability. It symbolizes the joy of achieving goals and celebrating bonds with community and family.", // 4
      "Represents competition, conflict, and diversity. It symbolizes situations where different opinions and goals clash, creating creative tension and challenges for growth.", // 5
      "Represents victory, recognition, and confidence. It symbolizes success where efforts are rewarded and recognized by others, and the confidence gained from it.", // 6
      "Represents defense, perseverance, and challenge. It symbolizes the struggle to defend acquired positions and the courage to face adversity.", // 7
      "Represents speed, action, and progress. It symbolizes a state where things develop rapidly and energy is concentrated in one direction.", // 8
      "Represents patience, perseverance, and the final trial. It symbolizes the last challenge after overcoming many difficulties and the strength to face it.", // 9
      "Represents burden, responsibility, and achievement. It symbolizes the many responsibilities brought by success and the pressure of bearing them.", // 10
      "Represents exploration, enthusiasm, and discovery. It symbolizes pure passion for new ideas and adventures, and curiosity to explore possibilities.", // Page
      "Represents energy, passion, and action. It symbolizes adventurous spirit, confident action, and momentum toward new challenges.", // Knight
      "Represents passion, determination, and confidence. It symbolizes attractive charisma and strong will to move toward one's goals.", // Queen
      "Represents vision, leadership, and honor. It symbolizes the power to transform creative energy into practical action and lead others.", // King
    ]

    const descriptions = language === "en" ? wandsDescriptionsEn : wandsDescriptionsJa
    return descriptions[cardId - 22] || (language === "en" ? "Description not found" : "説明が見つかりません")
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsDescriptionsJa = [
      "感情の新たな始まり、愛、直感、創造性を表します。感情的な充実と、心を開いて新しい関係や経験を受け入れる準備を象徴しています。", // エース
      "パートナーシップ、愛、調和を表します。二人の間の相互理解と、バランスのとれた関係性を象徴しています。", // 2
      "祝福、友情、共同体を表します。友人や仲間との喜びの共有と、支え合う関係の大切さを象徴しています。", // 3
      "瞑想、再評価、無関心を表します。現状に満足できず、新しい機会を見逃している状態と、内省の必要性を象徴しています。", // 4
      "喪失、後悔、悲しみを表します。失ったものに焦点を当てる悲しみと、まだ残されているものに気づく必要性を象徴しています。", // 5
      "ノスタルジア、幸せな記憶、無邪気さを表します。過去の喜びを思い出し、純粋な感情や関係を大切にする心を象徴しています。", // 6
      "選択肢、幻想、願望を表します。多くの可能性や夢の中から、現実的な選択をする必要性を象徴しています。", // 7
      "放棄、移行、前進を表します。感情的な満足が得られなくなった状況を離れ、より深い意味を求める旅を象徴しています。", // 8
      "満足、感情的な充実、願いの成就を表します。感情的な願望が叶い、幸福感と満足感に包まれる状態を象徴しています。", // 9
      "調和、家族の絆、完成した愛を表します。感情的な充実と、愛に満ちた家族や共同体の中での幸福を象徴しています。", // 10
      "創造的な機会、好奇心、可能性を表します。感情的な新しい始まりと、純粋な心で世界を探索する姿勢を象徴しています。", // ページ
      "ロマンス、魅力、想像力を表します。感情的な冒険に向かう姿勢と、理想を追求する情熱を象徴しています。", // ナイト
      "思いやり、愛、調和を表します。感情的な知性と直感力、そして他者を癒し支える能力を象徴しています。", // クイーン
      "感情的な制御、バランス、外交を表します。感情的な知恵と、感情を抑制しながらも深く理解する能力を象徴しています。", // キング
    ]

    const cupsDescriptionsEn = [
      "Represents a new beginning of emotions, love, intuition, and creativity. It symbolizes emotional fulfillment and the readiness to open the heart to new relationships and experiences.", // Ace
      "Represents partnership, love, and harmony. It symbolizes mutual understanding and balanced relationships between two people.", // 2
      "Represents celebration, friendship, and community. It symbolizes sharing joy with friends and companions and the importance of supportive relationships.", // 3
      "Represents meditation, re-evaluation, and indifference. It symbolizes the state of being unsatisfied with the current situation and missing new opportunities, and the need for introspection.", // 4
      "Represents loss, regret, and sadness. It symbolizes the grief of focusing on what has been lost and the need to realize what is still left.", // 5
      "Represents nostalgia, happy memories, and innocence. It symbolizes recalling past joys and cherishing pure emotions and relationships.", // 6
      "Represents choices, illusions, and wishes. It symbolizes the need to make realistic choices from many possibilities and dreams.", // 7
      "Represents abandonment, transition, and moving forward. It symbolizes leaving situations where emotional satisfaction is no longer obtained and embarking on a journey to seek deeper meaning.", // 8
      "Represents satisfaction, emotional fulfillment, and the fulfillment of wishes. It symbolizes the state of emotional desires being fulfilled and being enveloped in happiness and contentment.", // 9
      "Represents harmony, family bonds, and completed love. It symbolizes emotional fulfillment and happiness within a loving family or community.", // 10
      "Represents creative opportunities, curiosity, and potential. It symbolizes a new emotional beginning and the attitude of exploring the world with a pure heart.", // Page
      "Represents romance, charm, and imagination. It symbolizes the attitude of heading towards emotional adventures and the passion to pursue ideals.", // Knight
      "Represents compassion, love, and harmony. It symbolizes emotional intelligence and intuition, and the ability to heal and support others.", // Queen
      "Represents emotional control, balance, and diplomacy. It symbolizes emotional wisdom and the ability to deeply understand while suppressing emotions.", // King
    ]

    const descriptions = language === "en" ? cupsDescriptionsEn : cupsDescriptionsJa
    return descriptions[cardId - 36] || (language === "en" ? "Description not found" : "説明が見つかりません")
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsDescriptionsJa = [
      "明晰な思考、真実、突破口を表します。混乱を切り開く鋭い洞察力と、新たな理解や視点の始まりを象徴しています。", // エース
      "決断の遅れ、均衡、行き詰まりを表します。二つの選択肢の間で迷う状態と、感情と理性のバランスを取ろうとする努力を象徴しています。", // 2
      "悲しみ、心痛、失望を表します。感情的な痛みと、それを通じて成長し癒される過程を象徴しています。", // 3
      "休息、回復、瞑想を表します。闘争や困難の後の必要な休息と、内なる平和を取り戻す時間を象徴しています。", // 4
      "敗北、屈辱、勝利の空虚さを表します。対立における勝利が必ずしも真の成功ではないことと、競争の代償を象徴しています。", // 5
      "移行、変化、旅を表します。困難な状況から離れ、より平和な状態へと向かう過程と、必要な変化を受け入れる姿勢を象徴しています。", // 6
      "欺瞞、裏切り、策略を表します。正面からの対決を避け、隠れた方法で目標を達成しようとする姿勢を象徴しています。", // 7
      "制限、閉じ込め、無力感を表します。自分自身を縛る思考のパターンと、実際よりも選択肢が少ないと感じる状態を象徴しています。", // 8
      "不安、恐怖、悪夢を表します。夜中に目が覚めるような心配事と、実際よりも状況を悪く考えてしまう傾向を象徴しています。", // 9
      "終焉、崩壊、痛みを表します。ある状況や関係の完全な終わりと、それに伴う痛みを経て新たな始まりが可能になることを象徴しています。", // 10
      "好奇心、警戒心、新しいアイデアを表します。鋭い知性と観察力、そして真実を追求する姿勢を象徴しています。", // ページ
      "決意、野心、行動力を表します。目標に向かって迅速に進む姿勢と、障害を切り開く鋭い知性を象徴しています。", // ナイト
      "知性、独立心、公平さを表します。明晰な思考と直接的なコミュニケーション、そして感情に左右されない判断力を象徴しています。", // クイーン
      "権威、論理、正義を表します。知的な力と道徳的な権威、そして真実と公正さに基づいた判断を象徴しています。", // キング
    ]

    const swordsDescriptionsEn = [
      "Represents clear thinking, truth, and breakthroughs. It symbolizes sharp insight that cuts through confusion and the beginning of new understanding and perspectives.", // Ace
      "Represents delays in decision-making, equilibrium, and stalemate. It symbolizes being torn between two choices and the effort to balance emotions and reason.", // 2
      "Represents sadness, heartache, and disappointment. It symbolizes emotional pain and the process of growing and healing through it.", // 3
      "Represents rest, recovery, and meditation. It symbolizes the necessary rest after struggles and difficulties and the time to regain inner peace.", // 4
      "Represents defeat, humiliation, and the emptiness of victory. It symbolizes that victory in conflict is not always true success and the cost of competition.", // 5
      "Represents transition, change, and journeys. It symbolizes the process of moving away from difficult situations towards a more peaceful state and the willingness to accept necessary changes.", // 6
      "Represents deception, betrayal, and tactics. It symbolizes the attitude of avoiding direct confrontation and trying to achieve goals through hidden methods.", // 7
      "Represents limitations, confinement, and helplessness. It symbolizes thought patterns that bind oneself and the feeling of having fewer choices than actually exist.", // 8
      "Represents anxiety, fear, and nightmares. It symbolizes worries that wake you up in the middle of the night and the tendency to think of situations as worse than they are.", // 9
      "Represents endings, collapse, and pain. It symbolizes the complete end of a situation or relationship and the possibility of a new beginning after the accompanying pain.", // 10
      "Represents curiosity, vigilance, and new ideas. It symbolizes sharp intelligence and observation skills, and the attitude of pursuing truth.", // Page
      "Represents determination, ambition, and action. It symbolizes the attitude of moving quickly towards goals and the sharp intelligence to overcome obstacles.", // Knight
      "Represents intelligence, independence, and fairness. It symbolizes clear thinking and direct communication, and the ability to make judgments unaffected by emotions.", // Queen
      "Represents authority, logic, and justice. It symbolizes intellectual power and moral authority, and judgments based on truth and fairness.", // King
    ]

    const descriptions = language === "en" ? swordsDescriptionsEn : swordsDescriptionsJa
    return descriptions[cardId - 50] || (language === "en" ? "Description not found" : "説明が見つかりません")
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesDescriptionsJa = [
      "物質的な新しい始まり、繁栄、豊かさを表します。実践的な機会の到来と、安定した基盤を築く可能性を象徴しています。", // エース
      "バランス、適応性、優先順位付けを表します。複数の責任や課題をうまく管理し、変化する状況に柔軟に対応する能力を象徴しています。", // 2
      "チームワーク、コラボレーション、熟練を表します。共通の目標に向かって協力し、各自の技術や才能を活かす姿勢を象徴しています。", // 3
      "安全、保守的な管理、貪欲を表します。物質的な安全を確保したいという欲求と、変化や損失への恐れを象徴しています。", // 4
      "困難、貧困、心配を表します。物質的または精神的な困窮と、助けを求めることの重要性を象徴しています。", // 5
      "寛大さ、慈善、共有を表します。与えることと受け取ることのバランス、そして物質的な資源を分かち合う喜びを象徴しています。", // 6
      "忍耐、持続可能性、長期的な見通しを表します。努力の成果を評価し、将来の収穫のために投資する姿勢を象徴しています。", // 7
      "勤勉、技能、品質を表します。技術を磨き、細部にまで注意を払って仕事に取り組む姿勢を象徴しています。", // 8
      "豊かさ、贅沢、自立を表します。自分の努力によって得た物質的な成功と、それを楽しむ余裕を象徴しています。", // 9
      "家族の富、相続、確立を表します。世代を超えて受け継がれる豊かさと、安定した基盤の上に築かれた永続的な成功を象徴しています。", // 10
      "マニフェステーション、財政的な機会、技能の開発を表します。実践的な学習と、新しいプロジェクトや技術に対する熱心な姿勢を象徴しています。", // ページ
      "勤勉、責任、保守的を表します。着実に目標に向かって進む忍耐強さと、信頼性の高い行動力を象徴しています。", // ナイト
      "豊かさ、安全、実用性を表します。物質的な豊かさを育み、家庭や仕事の環境を整える能力を象徴しています。", // クイーン
      "豊かさ、ビジネス、リーダーシップを表します。物質的な成功と安定を築き、それを維持する能力を象徴しています。", // キング
    ]

    const pentaclesDescriptionsEn = [
      "Represents new material beginnings, prosperity, and abundance. It symbolizes the arrival of practical opportunities and the potential to build a stable foundation.", // Ace
      "Represents balance, adaptability, and prioritization. It symbolizes the ability to manage multiple responsibilities and challenges well and adapt flexibly to changing situations.", // 2
      "Represents teamwork, collaboration, and skill. It symbolizes the attitude of cooperating towards a common goal and utilizing each other's skills and talents.", // 3
      "Represents security, conservative management, and greed. It symbolizes the desire to ensure material security and the fear of change or loss.", // 4
      "Represents hardship, poverty, and worry. It symbolizes material or spiritual distress and the importance of seeking help.", // 5
      "Represents generosity, charity, and sharing. It symbolizes the balance of giving and receiving and the joy of sharing material resources.", // 6
      "Represents patience, sustainability, and long-term perspective. It symbolizes the attitude of evaluating the results of efforts and investing for future harvests.", // 7
      "Represents diligence, skill, and quality. It symbolizes the attitude of refining skills and working with attention to detail.", // 8
      "Represents abundance, luxury, and independence. It symbolizes material success gained through one's own efforts and the leisure to enjoy it.", // 9
      "Represents family wealth, inheritance, and establishment. It symbolizes wealth passed down through generations and lasting success built on a stable foundation.", // 10
      "Represents manifestation, financial opportunities, and skill development. It symbolizes practical learning and an enthusiastic attitude towards new projects and skills.", // Page
      "Represents diligence, responsibility, and conservatism. It symbolizes the perseverance to steadily move towards goals and reliable action.", // Knight
      "Represents abundance, security, and practicality. It symbolizes the ability to nurture material wealth and create a comfortable home and work environment.", // Queen
      "Represents abundance, business, and leadership. It symbolizes the ability to build and maintain material success and stability.", // King
    ]

    const descriptions = language === "en" ? pentaclesDescriptionsEn : pentaclesDescriptionsJa
    return descriptions[cardId - 64] || (language === "en" ? "Description not found" : "説明が見つかりません")
  }

  return language === "en" ? "Description not found" : "説明が見つかりません"
}

// カードの正位置の意味を取得する関数
export function getCardUpright(cardId: number, language = "ja"): string {
  // 大アルカナ（0-21）
  if (cardId >= 0 && cardId <= 21) {
    const uprightMeaningsJa = [
      "新しい始まり、冒険、無邪気さ、自由な精神、可能性、自発性",
      "創造力、意志力、熟練、リソースの活用、才能、集中力",
      "直感、無意識、内なる声、神秘、秘密、知恵",
      "豊かさ、創造性、母性、感性、自然との調和、育成",
      "権威、構造、秩序、リーダーシップ、安定、父性",
      "伝統、信念、教育、精神的指導、儀式、適合",
      "愛、調和、関係性、価値観の一致、選択",
      "意志力、決意、勝利、自己コントロール、前進",
      "内なる力、勇気、忍耐、慈悲、自信",
      "内省、孤独、指導、精神的な探求、知恵",
      "運命、循環、転機、幸運、変化、進化",
      "公正、真実、法、バランス、因果関係",
      "犠牲、放棄、新たな視点、待機、降伏",
      "終わり、始まり、変容、解放、移行",
      "バランス、調和、中庸、忍耐、統合",
      "束縛、依存、物質主義、欲望、恐怖",
      "突然の変化、混乱、啓示、崩壊、解放",
      "希望、インスピレーション、平静、再生、信頼",
      "幻想、不確実性、直感、潜在意識、恐怖",
      "喜び、成功、活力、明晰さ、真実、楽観主義",
      "再生、決断、呼びかけ、目覚め、解放",
      "完成、統合、達成、旅の終わり、充実感",
    ]

    const uprightMeaningsEn = [
      "New beginnings, adventure, innocence, free spirit, potential, spontaneity",
      "Creativity, willpower, skill, resource utilization, talent, focus",
      "Intuition, unconscious, inner voice, mystery, secrets, wisdom",
      "Abundance, creativity, motherhood, sensitivity, harmony with nature, nurturing",
      "Authority, structure, order, leadership, stability, fatherhood",
      "Tradition, belief, education, spiritual guidance, ritual, conformity",
      "Love, harmony, relationships, shared values, choice",
      "Willpower, determination, victory, self-control, progress",
      "Inner strength, courage, patience, compassion, confidence",
      "Introspection, solitude, guidance, spiritual quest, wisdom",
      "Destiny, cycles, turning points, good fortune, change, evolution",
      "Justice, truth, law, balance, cause and effect",
      "Sacrifice, surrender, new perspective, waiting, submission",
      "Endings, beginnings, transformation, liberation, transition",
      "Balance, harmony, moderation, patience, integration",
      "Bondage, dependence, materialism, desire, fear",
      "Sudden change, chaos, revelation, collapse, liberation",
      "Hope, inspiration, tranquility, renewal, trust",
      "Illusion, uncertainty, intuition, subconscious, fear",
      "Joy, success, vitality, clarity, truth, optimism",
      "Rebirth, decision, calling, awakening, liberation",
      "Completion, integration, achievement, journey's end, fulfillment",
    ]

    const meanings = language === "en" ? uprightMeaningsEn : uprightMeaningsJa
    return meanings[cardId] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsUprightMeaningsJa = [
      "創造性、情熱、インスピレーション、新しい始まり、可能性", // エース
      "計画、決断、将来の展望、進歩、発見", // 2
      "拡大、成長、長期的な視野、先見性、国際的な機会", // 3
      "祝福、調和、家庭、コミュニティ、達成感", // 4
      "競争、衝突、多様性、テスト、挑戦", // 5
      "勝利、認識、自信、達成、誇り", // 6
      "防御、忍耐、挑戦、競争、決意", // 7
      "速度、行動、進歩、効率、旅行", // 8
      "忍耐、持続力、最後の試練、警戒、回復力", // 9
      "重荷、責任、達成、ストレス、圧力", // 10
      "探検、熱意、発見、自由な精神、冒険", // ページ
      "エネルギー、情熱、行動、冒険、衝動", // ナイト
      "情熱、決断力、自信、社交性、魅力", // クイーン
      "ビジョン、リーダーシップ、名誉、自信、創造性", // キング
    ]

    const wandsUprightMeaningsEn = [
      "Creativity, passion, inspiration, new beginnings, potential", // Ace
      "Planning, decisions, future prospects, progress, discovery", // 2
      "Expansion, growth, long-term vision, foresight, international opportunities", // 3
      "Blessings, harmony, home, community, sense of accomplishment", // 4
      "Competition, conflict, diversity, tests, challenges", // 5
      "Victory, recognition, confidence, achievement, pride", // 6
      "Defense, patience, challenge, competition, determination", // 7
      "Speed, action, progress, efficiency, travel", // 8
      "Patience, endurance, final trial, vigilance, resilience", // 9
      "Burden, responsibility, achievement, stress, pressure", // 10
      "Exploration, enthusiasm, discovery, free spirit, adventure", // Page
      "Energy, passion, action, adventure, impulse", // Knight
      "Passion, determination, confidence, sociability, charm", // Queen
      "Vision, leadership, honor, confidence, creativity", // King
    ]

    const meanings = language === "en" ? wandsUprightMeaningsEn : wandsUprightMeaningsJa
    return meanings[cardId - 22] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsUprightMeaningsJa = [
      "愛、新しい関係、感情の豊かさ、創造性、直感", // エース
      "パートナーシップ、愛、調和、相互理解、結合", // 2
      "祝福、友情、共同体、喜び、協力", // 3
      "瞑想、再評価、無関心、倦怠感、内省", // 4
      "喪失、後悔、悲しみ、失望、自己憐憫", // 5
      "ノスタルジア、幸せな記憶、無邪気さ、贈り物", // 6
      "選択肢、幻想、願望、誘惑、可能性", // 7
      "放棄、移行、前進、自己探求、変化", // 8
      "満足、感情的な充実、願いの成就、幸福", // 9
      "調和、家族の絆、完成した愛、平和、共同体", // 10
      "創造的な機会、好奇心、可能性、メッセージ", // ページ
      "ロマンス、魅力、想像力、提案、行動", // ナイト
      "思いやり、愛、調和、直感、癒し", // クイーン
      "感情的な制御、バランス、外交、知恵", // キング
    ]

    const cupsUprightMeaningsEn = [
      "Love, new relationships, emotional abundance, creativity, intuition", // Ace
      "Partnership, love, harmony, mutual understanding, union", // 2
      "Blessings, friendship, community, joy, cooperation", // 3
      "Meditation, re-evaluation, indifference, boredom, introspection", // 4
      "Loss, regret, sadness, disappointment, self-pity", // 5
      "Nostalgia, happy memories, innocence, gifts", // 6
      "Choices, illusions, desires, temptations, possibilities", // 7
      "Abandonment, transition, moving forward, self-discovery, change", // 8
      "Satisfaction, emotional fulfillment, wish fulfillment, happiness", // 9
      "Harmony, family bonds, completed love, peace, community", // 10
      "Creative opportunities, curiosity, potential, messages", // Page
      "Romance, charm, imagination, proposals, action", // Knight
      "Compassion, love, harmony, intuition, healing", // Queen
      "Emotional control, balance, diplomacy, wisdom", // King
    ]

    const meanings = language === "en" ? cupsUprightMeaningsEn : cupsUprightMeaningsJa
    return meanings[cardId - 36] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsUprightMeaningsJa = [
      "明晰な思考、真実、突破口、新しい考え、勝利", // エース
      "決断の遅れ、均衡、行き詰まり、中立性、選択の回避", // 2
      "悲しみ、心痛、失望、裏切り、解放", // 3
      "休息、回復、瞑想、内省、静養", // 4
      "敗北、屈辱、勝利の空虚さ、対立、損失", // 5
      "移行、変化、旅、離脱、前進", // 6
      "欺瞞、裏切り、策略、回避、秘密", // 7
      "制限、閉じ込め、無力感、恐怖、被害者意識", // 8
      "不安、恐怖、悪夢、心配、罪悪感", // 9
      "終焉、崩壊、痛み、深い傷、犠牲", // 10
      "好奇心、警戒心、新しいアイデア、真実、勇気", // ページ
      "決意、野心、行動力、知性、真実の追求", // ナイト
      "知性、独立心、公平さ、明晰さ、誠実さ", // クイーン
      "権威、論理、正義、真実、明晰な思考", // キング
    ]

    const swordsUprightMeaningsEn = [
      "Clear thinking, truth, breakthrough, new ideas, victory", // Ace
      "Delay in decision, equilibrium, stalemate, neutrality, avoidance of choice", // 2
      "Sadness, heartache, disappointment, betrayal, liberation", // 3
      "Rest, recovery, meditation, introspection, repose", // 4
      "Defeat, humiliation, emptiness of victory, conflict, loss", // 5
      "Transition, change, journey, withdrawal, progress", // 6
      "Deception, betrayal, tactics, evasion, secrets", // 7
      "Restriction, confinement, helplessness, fear, victim mentality", // 8
      "Anxiety, fear, nightmares, worry, guilt", // 9
      "Endings, collapse, pain, deep wounds, sacrifice", // 10
      "Curiosity, vigilance, new ideas, truth, courage", // Page
      "Determination, ambition, action, intelligence, pursuit of truth", // Knight
      "Intelligence, independence, fairness, clarity, integrity", // Queen
      "Authority, logic, justice, truth, clear thinking", // King
    ]

    const meanings = language === "en" ? swordsUprightMeaningsEn : swordsUprightMeaningsJa
    return meanings[cardId - 50] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesUprightMeaningsJa = [
      "物質的な機会、繁栄、新しい冒険、安定", // エース
      "バランス、適応性、時間管理、優先順位付け", // 2
      "チームワーク、コラボレーション、熟練、品質", // 3
      "安全、保守的な管理、貪欲、安定", // 4
      "困難、貧困、心配、孤立、不安", // 5
      "寛大さ、慈善、共有、援助、恩恵", // 6
      "忍耐、持続可能性、長期的な見通し、評価", // 7
      "勤勉、技能、品質、専念、熟練", // 8
      "豊かさ、贅沢、自立、自己充足、優雅さ", // 9
      "家族の富、相続、確立、伝統、安全", // 10
      "マニフェステーション、財政的な機会、技能の開発", // ページ
      "勤勉、責任、保守的、忍耐、信頼性", // ナイト
      "豊かさ、安全、実用性、母性、寛大さ", // クイーン
      "豊かさ、ビジネス、リーダーシップ、安全、実用性", // キング
    ]

    const pentaclesUprightMeaningsEn = [
      "Material opportunities, prosperity, new adventures, stability", // Ace
      "Balance, adaptability, time management, prioritization", // 2
      "Teamwork, collaboration, skill, quality", // 3
      "Security, conservative management, greed, stability", // 4
      "Hardship, poverty, worry, isolation, anxiety", // 5
      "Generosity, charity, sharing, aid, benefit", // 6
      "Patience, sustainability, long-term outlook, evaluation", // 7
      "Diligence, skill, quality, dedication, mastery", // 8
      "Abundance, luxury, independence, self-sufficiency, grace", // 9
      "Family wealth, inheritance, establishment, tradition, security", // 10
      "Manifestation, financial opportunities, skill development", // Page
      "Diligence, responsibility, conservatism, patience, reliability", // Knight
      "Abundance, security, practicality, motherhood, generosity", // Queen
      "Abundance, business, leadership, security, practicality", // King
    ]

    const meanings = language === "en" ? pentaclesUprightMeaningsEn : pentaclesUprightMeaningsJa
    return meanings[cardId - 64] || (language === "en" ? "No information" : "情報なし")
  }

  return language === "en" ? "No information" : "情報なし"
}

// カードの逆位置の意味を取得する関数
export function getCardReversed(cardId: number, language = "ja"): string {
  // 大アルカナ（0-21）
  if (cardId >= 0 && cardId <= 21) {
    const reversedMeaningsJa = [
      "無謀、軽率、リスク、無計画、愚かさ",
      "操作、欺瞞、才能の無駄遣い、未熟さ",
      "秘密の露呈、表面的な理解、混乱、無視された直感",
      "依存、過保護、創造性の欠如、不毛",
      "独裁、過度な支配、柔軟性の欠如、未熟なリーダーシップ",
      "反抗、非伝統的、不適合、独自の道",
      "不調和、不均衡、価値観の相違、誤った選択",
      "自己制御の欠如、攻撃性、障害、方向性の喪失",
      "弱さ、自信喪失、自己疑念、臆病さ",
      "孤立、拒絶、引きこもり、未熟さ",
      "不運、抵抗、予期せぬ変化、運命への抗い",
      "不公平、不均衡、偏見、不正",
      "抵抗、無駄な努力、執着、遅延",
      "抵抗、停滞、拒絶、不完全な変化",
      "不均衡、過剰、不調和、衝突",
      "解放、独立、制限からの脱出、力の回復",
      "避けられた災害、漸進的な変化、恐怖",
      "絶望、不信、落胆、悲観主義",
      "恐怖の解消、明晰さ、真実の露呈、混乱の終わり",
      "過度な楽観主義、幻滅、一時的な喜び",
      "自己疑念、拒絶、後悔、判断の誤り",
      "未完成、停滞、閉鎖性、目標の未達成",
    ]

    const reversedMeaningsEn = [
      "Recklessness, carelessness, risk, lack of planning, foolishness",
      "Manipulation, deception, waste of talent, immaturity",
      "Revelation of secrets, superficial understanding, confusion, ignored intuition",
      "Dependence, overprotection, lack of creativity, barrenness",
      "Tyranny, excessive control, lack of flexibility, immature leadership",
      "Rebellion, unconventional, nonconformity, own path",
      "Disharmony, imbalance, value differences, wrong choices",
      "Lack of self-control, aggression, obstacles, loss of direction",
      "Weakness, loss of confidence, self-doubt, cowardice",
      "Isolation, rejection, withdrawal, immaturity",
      "Bad luck, resistance, unexpected change, fighting fate",
      "Unfairness, imbalance, prejudice, injustice",
      "Resistance, wasted effort, attachment, delay",
      "Resistance, stagnation, rejection, incomplete change",
      "Imbalance, excess, disharmony, conflict",
      "Liberation, independence, escape from restrictions, recovery of power",
      "Avoided disaster, gradual change, fear",
      "Despair, distrust, discouragement, pessimism",
      "Resolution of fear, clarity, revelation of truth, end of confusion",
      "Excessive optimism, disillusionment, temporary joy",
      "Self-doubt, rejection, regret, misjudgment",
      "Incompletion, stagnation, closure, unachieved goals",
    ]

    const meanings = language === "en" ? reversedMeaningsEn : reversedMeaningsJa
    return meanings[cardId] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsReversedMeaningsJa = [
      "遅延、創造性の欠如、意欲低下、停滞", // エース
      "恐怖、優柔不断、計画の欠如、冒険の欠如", // 2
      "障害、遅延、失望、限界", // 3
      "移行、不安定、家庭内の緊張", // 4
      "協力、合意、調和の回復", // 5
      "自己疑念、傲慢、過信、失敗", // 6
      "降伏、圧倒、自信喪失", // 7
      "遅延、欲求不満、停滞、内部対立", // 8
      "疲労、降伏、圧倒、パラノイア", // 9
      "重荷の解放、委任、燃え尽き", // 10
      "優柔不断、エネルギーの分散、遅延、悪いニュース", // ページ
      "怒り、衝動性、無謀、遅延", // ナイト
      "要求が多い、攻撃的、不安定、嫉妬", // クイーン
      "専制的、短気、傲慢、衝動的", // キング
    ]

    const wandsReversedMeaningsEn = [
      "Delay, lack of creativity, decreased motivation, stagnation", // Ace
      "Fear, indecision, lack of planning, lack of adventure", // 2
      "Obstacles, delays, disappointment, limitations", // 3
      "Transition, instability, tension within the home", // 4
      "Cooperation, agreement, restoration of harmony", // 5
      "Self-doubt, arrogance, overconfidence, failure", // 6
      "Surrender, overwhelm, loss of confidence", // 7
      "Delay, frustration, stagnation, internal conflict", // 8
      "Fatigue, surrender, overwhelm, paranoia", // 9
      "Release of burden, delegation, burnout", // 10
      "Indecision, dispersion of energy, delay, bad news", // Page
      "Anger, impulsiveness, recklessness, delay", // Knight
      "Demanding, aggressive, unstable, jealous", // Queen
      "Dictatorial, short-tempered, arrogant, impulsive", // King
    ]

    const meanings = language === "en" ? wandsReversedMeaningsEn : wandsReversedMeaningsJa
    return meanings[cardId - 22] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsReversedMeaningsJa = [
      "感情の抑制、不安定な関係、愛の欠如、閉鎖性", // エース
      "不調和、分離、緊張、コミュニケーション不足", // 2
      "過剰、グループからの排除、三角関係", // 3
      "新たな欲望、行動、機会の受け入れ", // 4
      "受容、前進、希望の回復、癒し", // 5
      "過去への執着、非現実的な期待、停滞", // 6
      "明晰さ、焦点、決断、現実的な選択", // 7
      "恐怖、立ち往生、無気力、混乱", // 8
      "物質主義、不満、過剰、表面的な幸福", // 9
      "崩壊した家族、不調和、不一致、価値観の相違", // 10
      "感情的な未熟さ、依存、失望、幻滅", // ページ
      "感情の操作、嫉妬、気まぐれ、欺瞞", // ナイト
      "依存、操作、感情の不安定さ、自己犠牲", // クイーン
      "感情的な操作、冷淡さ、不誠実、抑圧", // キング
    ]

    const cupsReversedMeaningsEn = [
      "Emotional suppression, unstable relationships, lack of love, closedness", // Ace
      "Disharmony, separation, tension, lack of communication", // 2
      "Excess, exclusion from the group, love triangle", // 3
      "New desires, actions, acceptance of opportunities", // 4
      "Acceptance, moving forward, recovery of hope, healing", // 5
      "Attachment to the past, unrealistic expectations, stagnation", // 6
      "Clarity, focus, decision, realistic choice", // 7
      "Fear, being stuck, lethargy, confusion", // 8
      "Materialism, dissatisfaction, excess, superficial happiness", // 9
      "Broken family, disharmony, disagreement, differences in values", // 10
      "Emotional immaturity, dependence, disappointment, disillusionment", // Page
      "Emotional manipulation, jealousy, capriciousness, deception", // Knight
      "Dependence, manipulation, emotional instability, self-sacrifice", // Queen
      "Emotional manipulation, coldness, dishonesty, repression", // King
    ]

    const meanings = language === "en" ? cupsReversedMeaningsEn : cupsReversedMeaningsJa
    return meanings[cardId - 36] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsReversedMeaningsJa = [
      "混乱、破壊的な力、真実の欠如、誤った判断", // エース
      "決断の時、混乱の解消、緊張の解放", // 2
      "回復、赦し、解放、混乱", // 3
      "疲労、燃え尽き、ストレス、活動再開", // 4
      "和解、復活、解放、前進", // 5
      "停滞、遅延、足止め、抵抗", // 6
      "告白、悔い改め、正直さ、真実の露呈", // 7
      "解放、エンパワーメント、新しい視点、勇気", // 8
      "希望、楽観主義、回復、真実の直面", // 9
      "回復、再生、復活、前進", // 10
      "無謀、ゴシップ、非難、遅延、恐怖", // ページ
      "衝動性、無謀さ、攻撃性、混乱", // ナイト
      "批判的、冷酷、感情の欠如、不誠実", // クイーン
      "独裁的、不寛容、残酷さ、操作", // キング
    ]

    const swordsReversedMeaningsEn = [
      "Confusion, destructive forces, lack of truth, misjudgment", // Ace
      "Time of decision, resolution of confusion, release of tension", // 2
      "Recovery, forgiveness, liberation, confusion", // 3
      "Fatigue, burnout, stress, resumption of activity", // 4
      "Reconciliation, revival, liberation, moving forward", // 5
      "Stagnation, delay, standstill, resistance", // 6
      "Confession, repentance, honesty, revelation of truth", // 7
      "Liberation, empowerment, new perspective, courage", // 8
      "Hope, optimism, recovery, facing the truth", // 9
      "Recovery, regeneration, resurrection, moving forward", // 10
      "Recklessness, gossip, accusation, delay, fear", // Page
      "Impulsiveness, recklessness, aggression, confusion", // Knight
      "Critical, ruthless, lack of emotion, dishonesty", // Queen
      "Dictatorial, intolerance, cruelty, manipulation", // King
    ]

    const meanings = language === "en" ? swordsReversedMeaningsEn : swordsReversedMeaningsJa
    return meanings[cardId - 50] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesReversedMeaningsJa = [
      "物質的な損失、機会の喪失、貪欲、物質主義", // エース
      "不均衡、無秩序、優先順位の誤り、ストレス", // 2
      "無能、低品質の仕事、不和、競争", // 3
      "過剰支出、貪欲、物質的な不安、解放", // 4
      "回復、慈善、希望、精神的な豊かさ", // 5
      "自己中心的、不平等、借金、見返りを求める", // 6
      "結果の欠如、無駄な投資、焦り、短期的思考", // 7
      "怠惰、低品質、無気力、完璧主義", // 8
      "物質的な喪失、依存、虚栄心、見せびらかし", // 9
      "家族の争い、財政的な失敗、不安定、孤立", // 10
      "浪費、未熟さ、欠如、怠惰、機会の喪失", // ページ
      "怠惰、停滞、退屈、頑固、過度の慎重さ", // ナイト
      "自己中心的、嫉妬、不安、物質主義", // クイーン
      "貪欲、物質主義、浪費、不安定、頑固", // キング
    ]

    const pentaclesReversedMeaningsEn = [
      "Material loss, loss of opportunity, greed, materialism", // Ace
      "Imbalance, disorder, wrong priorities, stress", // 2
      "Incompetence, low-quality work, discord, competition", // 3
      "Overspending, greed, material insecurity, liberation", // 4
      "Recovery, charity, hope, spiritual abundance", // 5
      "Selfishness, inequality, debt, seeking returns", // 6
      "Lack of results, wasted investment, impatience, short-term thinking", // 7
      "Laziness, low quality, lethargy, perfectionism", // 8
      "Material loss, dependence, vanity, showing off", // 9
      "Family disputes, financial failure, instability, isolation", // 10
      "Waste, immaturity, lack, laziness, loss of opportunity", // Page
      "Laziness, stagnation, boredom, stubbornness, excessive caution", // Knight
      "Selfishness, jealousy, anxiety, materialism", // Queen
      "Greed, materialism, waste, instability, stubbornness", // King
    ]

    const meanings = language === "en" ? pentaclesReversedMeaningsEn : pentaclesReversedMeaningsJa
    return meanings[cardId - 64] || (language === "en" ? "No information" : "情報なし")
  }

  return language === "en" ? "No information" : "情報なし"
}

// カードのキーワードを取得する関数
export function getCardKeywords(cardId: number, language = "ja"): string {
  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsKeywordsJa = [
      "創造性, 情熱, 新しい始まり", // エース
      "計画, 決断, 将来の展望", // 2
      "拡大, 成長, 長期的な視野", // 3
      "祝福, 調和, 家庭の安定", // 4
      "競争, 衝突, 多様性", // 5
      "勝利, 認識, 自信", // 6
      "防御, 忍耐, 挑戦", // 7
      "速度, 行動, 進歩", // 8
      "忍耐, 持続力, 最後の試練", // 9
      "重荷, 責任, 達成", // 10
      "探検, 熱意, 発見", // ページ
      "エネルギー, 情熱, 行動", // ナイト
      "情熱, 決断力, 自信", // クイーン
      "ビジョン, リーダーシップ, 名誉", // キング
    ]

    const wandsKeywordsEn = [
      "Creativity, Passion, New beginnings", // Ace
      "Planning, Decisions, Future prospects", // 2
      "Expansion, Growth, Long-term vision", // 3
      "Celebration, Harmony, Domestic stability", // 4
      "Competition, Conflict, Diversity", // 5
      "Victory, Recognition, Confidence", // 6
      "Defense, Perseverance, Challenge", // 7
      "Speed, Action, Progress", // 8
      "Patience, Endurance, Final trial", // 9
      "Burden, Responsibility, Achievement", // 10
      "Exploration, Enthusiasm, Discovery", // Page
      "Energy, Passion, Action", // Knight
      "Passion, Determination, Confidence", // Queen
      "Vision, Leadership, Honor", // King
    ]

    const keywords = language === "en" ? wandsKeywordsEn : wandsKeywordsJa
    return keywords[cardId - 22] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsKeywordsJa = [
      "愛, 新しい関係, 感情の豊かさ", // エース
      "パートナーシップ, 愛, 調和", // 2
      "祝福, 友情, 共同体", // 3
      "瞑想, 再評価, 無関心", // 4
      "喪失, 後悔, 悲しみ", // 5
      "ノスタルジア, 幸せな記憶, 無邪気さ", // 6
      "選択肢, 幻想, 願望", // 7
      "放棄, 移行, 前進", // 8
      "満足, 感情的な充実, 願いの成就", // 9
      "調和, 家族の絆, 完成した愛", // 10
      "創造的な機会, 好奇心, 可能性", // ページ
      "ロマンス, 魅力, 想像力", // ナイト
      "思いやり, 愛, 調和", // クイーン
      "感情的な制御, バランス, 外交", // キング
    ]

    const cupsKeywordsEn = [
      "Love, New relationships, Emotional abundance", // Ace
      "Partnership, Love, Harmony", // 2
      "Celebration, Friendship, Community", // 3
      "Meditation, Re-evaluation, Indifference", // 4
      "Loss, Regret, Sadness", // 5
      "Nostalgia, Happy memories, Innocence", // 6
      "Choices, Illusions, Desires", // 7
      "Abandonment, Transition, Moving forward", // 8
      "Satisfaction, Emotional fulfillment, Wish fulfillment", // 9
      "Harmony, Family bonds, Completed love", // 10
      "Creative opportunities, Curiosity, Potential", // Page
      "Romance, Charm, Imagination", // Knight
      "Compassion, Love, Harmony", // Queen
      "Emotional control, Balance, Diplomacy", // King
    ]

    const keywords = language === "en" ? cupsKeywordsEn : cupsKeywordsJa
    return keywords[cardId - 36] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsKeywordsJa = [
      "明晰な思考, 真実, 突破口", // エース
      "決断の遅れ, 均衡, 行き詰まり", // 2
      "悲しみ, 心痛, 失望", // 3
      "休息, 回復, 瞑想", // 4
      "敗北, 屈辱, 勝利の空虚さ", // 5
      "移行, 変化, 旅", // 6
      "欺瞞, 裏切り, 策略", // 7
      "制限, 閉じ込め, 無力感", // 8
      "不安, 恐怖, 悪夢", // 9
      "終焉, 崩壊, 痛み", // 10
      "好奇心, 警戒心, 新しいアイデア", // ページ
      "決意, 野心, 行動力", // ナイト
      "知性, 独立心, 公平さ", // クイーン
      "権威, 論理, 正義", // キング
    ]

    const swordsKeywordsEn = [
      "Clear thinking, Truth, Breakthrough", // Ace
      "Delayed decision, Equilibrium, Stalemate", // 2
      "Sadness, Heartache, Disappointment", // 3
      "Rest, Recovery, Meditation", // 4
      "Defeat, Humiliation, Emptiness of victory", // 5
      "Transition, Change, Journey", // 6
      "Deception, Betrayal, Tactics", // 7
      "Restriction, Confinement, Helplessness", // 8
      "Anxiety, Fear, Nightmares", // 9
      "Endings, Collapse, Pain", // 10
      "Curiosity, Vigilance, New ideas", // Page
      "Determination, Ambition, Action", // Knight
      "Intelligence, Independence, Fairness", // Queen
      "Authority, Logic, Justice", // King
    ]

    const keywords = language === "en" ? swordsKeywordsEn : swordsKeywordsJa
    return keywords[cardId - 50] || (language === "en" ? "No information" : "情報なし")
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesKeywordsJa = [
      "物質的な機会, 繁栄, 新しい冒険", // エース
      "バランス, 適応性, 時間管理", // 2
      "チームワーク, コラボレーション, 熟練", // 3
      "安全, 保守的な管理, 貪欲", // 4
      "困難, 貧困, 心配", // 5
      "寛大さ, 慈善, 共有", // 6
      "忍耐, 持続可能性, 長期的な見通し", // 7
      "勤勉, 技能, 品質", // 8
      "豊かさ, 贅沢, 自立", // 9
      "家族の富, 相続, 確立", // 10
      "マニフェステーション, 財政的な機会, 技能の開発", // ページ
      "勤勉, 責任, 保守的", // ナイト
      "豊かさ, 安全, 実用性", // クイーン
      "豊かさ, ビジネス, リーダーシップ", // キング
    ]

    const pentaclesKeywordsEn = [
      "Material opportunities, Prosperity, New adventures", // Ace
      "Balance, Adaptability, Time management", // 2
      "Teamwork, Collaboration, Skill", // 3
      "Security, Conservative management, Greed", // 4
      "Hardship, Poverty, Worry", // 5
      "Generosity, Charity, Sharing", // 6
      "Patience, Sustainability, Long-term outlook", // 7
      "Diligence, Skill, Quality", // 8
      "Abundance, Luxury, Independence", // 9
      "Family wealth, Inheritance, Establishment", // 10
      "Manifestation, Financial opportunities, Skill development", // Page
      "Diligence, Responsibility, Conservative", // Knight
      "Abundance, Security, Practicality", // Queen
      "Abundance, Business, Leadership", // King
    ]

    const keywords = language === "en" ? pentaclesKeywordsEn : pentaclesKeywordsJa
    return keywords[cardId - 64] || (language === "en" ? "No information" : "情報なし")
  }

  return language === "en" ? "Minor Arcana, Tarot" : "小アルカナ, タロット"
}

// カードのポジティブ解釈を取得する関数
export function getCardPositiveMeaning(cardId: number, language = "ja"): string {
  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsPositiveMeaningsJa = [
      "創造的なプロジェクトが成功し、情熱的なエネルギーが新たな可能性を開きます。", // エース
      "将来への明確なビジョンを持ち、計画的に目標に向かって進むことができます。", // 2
      "長期的な視野で事業を拡大し、国際的な成功を収める可能性があります。", // 3
      "家庭や職場での調和が実現し、共同体の中で安定した幸福を享受できます。", // 4
      "健全な競争を通じて成長し、多様な意見から新たなアイデアを得られます。", // 5
      "努力が認められ、周囲からの称賛と自信を得て、さらなる成功へと導かれます。", // 6
      "困難に立ち向かう勇気と忍耐力で、最終的に勝利を手にすることができます。", // 7
      "物事が急速に進展し、エネルギッシュな行動で目標を達成できます。", // 8
      "最後の試練を乗り越える強さを持ち、持続的な努力が報われます。", // 9
      "責任ある立場での成功を収め、多くの人々に影響を与える力を持ちます。", // 10
      "新しい冒険への純粋な情熱で、未知の可能性を発見することができます。", // ページ
      "エネルギッシュな行動力で、新たな挑戦に果敢に取り組むことができます。", // ナイト
      "魅力的なリーダーシップで人々を魅了し、自信を持って目標を達成します。", // クイーン
      "創造的なビジョンを実現し、他者を導く優れたリーダーシップを発揮します。", // キング
    ]

    const wandsPositiveMeaningsEn = [
      "Creative projects succeed, and passionate energy opens new possibilities.", // Ace
      "You can have a clear vision for the future and move toward goals in a planned manner.", // 2
      "You can expand your business with a long-term perspective and achieve international success.", // 3
      "Harmony in home and workplace is realized, and you can enjoy stable happiness within the community.", // 4
      "You grow through healthy competition and gain new ideas from diverse opinions.", // 5
      "Your efforts are recognized, and you gain praise and confidence from those around you, leading to further success.", // 6
      "With courage and perseverance to face difficulties, you can ultimately achieve victory.", // 7
      "Things develop rapidly, and you can achieve goals through energetic action.", // 8
      "You have the strength to overcome the final trial, and sustained effort is rewarded.", // 9
      "You achieve success in a responsible position and have the power to influence many people.", // 10
      "With pure passion for new adventures, you can discover unknown possibilities.", // Page
      "With energetic action, you can boldly take on new challenges.", // Knight
      "You captivate people with attractive leadership and achieve goals with confidence.", // Queen
      "You realize creative visions and demonstrate excellent leadership that guides others.", // King
    ]

    const meanings = language === "en" ? wandsPositiveMeaningsEn : wandsPositiveMeaningsJa
    return (
      meanings[cardId - 22] ||
      (language === "en"
        ? "This card brings positive energy and opportunities for growth."
        : "このカードはポジティブなエネルギーと成長の機会をもたらします。")
    )
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsPositiveMeaningsJa = [
      "新しい愛や深い感情的なつながりが生まれ、創造的なインスピレーションに満たされます。", // エース
      "理想的なパートナーシップが築かれ、相互理解と愛に基づいた関係が発展します。", // 2
      "友人や仲間との絆が深まり、共に喜びを分かち合う幸せな時間を過ごせます。", // 3
      "内省を通じて新たな感情的な気づきを得て、より深い自己理解に到達します。", // 4
      "失ったものを乗り越えて、残されたものの価値を再発見し、希望を取り戻します。", // 5
      "過去の美しい思い出が心を癒し、純粋な愛と無邪気さを思い出させてくれます。", // 6
      "多くの選択肢の中から最適なものを選び、夢を現実化する道筋が見えてきます。", // 7
      "より深い意味を求める旅に出て、精神的な成長と自己発見を遂げます。", // 8
      "感情的な願いが叶い、満足感と幸福感に包まれた充実した生活を送れます。", // 9
      "家族や愛する人々との完璧な調和の中で、愛に満ちた幸せな生活を築けます。", // 10
      "感情的な新しい始まりに向けて、純粋な心で世界を探索する機会に恵まれます。", // ページ
      "ロマンチックな冒険に向かい、理想を追求する情熱的な旅路を歩むことができます。", // ナイト
      "深い思いやりと愛で他者を癒し、調和のとれた関係を築く力を発揮します。", // クイーン
      "感情的な知恵とバランスで、周囲の人々を導き支える優れた指導力を示します。", // キング
    ]

    const cupsPositiveMeaningsEn = [
      "New love and deep emotional connections are born, and you are filled with creative inspiration.", // Ace
      "Ideal partnerships are built, and relationships based on mutual understanding and love develop.", // 2
      "Bonds with friends and companions deepen, and you can spend happy times sharing joy together.", // 3
      "Through introspection, you gain new emotional insights and reach deeper self-understanding.", // 4
      "You overcome what was lost, rediscover the value of what remains, and regain hope.", // 5
      "Beautiful memories from the past heal the heart and remind you of pure love and innocence.", // 6
      "You choose the best from many options, and the path to realizing dreams becomes visible.", // 7
      "You embark on a journey seeking deeper meaning and achieve spiritual growth and self-discovery.", // 8
      "Emotional wishes are fulfilled, and you can live a fulfilling life enveloped in satisfaction and happiness.", // 9
      "In perfect harmony with family and loved ones, you can build a happy life filled with love.", // 10
      "You are blessed with opportunities to explore the world with a pure heart toward new emotional beginnings.", // Page
      "You can head toward romantic adventures and walk a passionate journey pursuing ideals.", // Knight
      "You demonstrate the power to heal others with deep compassion and love and build harmonious relationships.", // Queen
      "You show excellent leadership that guides and supports those around you with emotional wisdom and balance.", // King
    ]

    const meanings = language === "en" ? cupsPositiveMeaningsEn : cupsPositiveMeaningsJa
    return (
      meanings[cardId - 36] ||
      (language === "en"
        ? "This card brings positive energy and opportunities for growth."
        : "このカードはポジティブなエネルギーと成長の機会をもたらします。")
    )
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsPositiveMeaningsJa = [
      "明晰な思考と鋭い洞察力で、複雑な問題の解決策を見つけることができます。", // エース
      "冷静な判断で最適な選択を行い、バランスのとれた決断を下すことができます。", // 2
      "感情的な痛みを乗り越えて、より強く賢い人間として成長することができます。", // 3
      "必要な休息を取ることで、心身を回復し新たなエネルギーを蓄えることができます。", // 4
      "過去の対立から学び、より建設的なアプローチで問題解決に取り組めます。", // 5
      "困難な状況から脱出し、より平和で安定した環境へと移行することができます。", // 6
      "戦略的な思考で目標を達成し、知恵を使って困難を回避することができます。", // 7
      "制限的な思考から解放され、新たな視点で可能性を発見することができます。", // 8
      "不安や恐怖を克服し、現実を正しく認識して前向きに進むことができます。", // 9
      "困難な状況の完全な終結により、新たな始まりへの道が開かれます。", // 10
      "鋭い観察力と好奇心で、真実を追求し新たな知識を獲得することができます。", // ページ
      "明確な目標に向かって迅速に行動し、知的な力で障害を克服することができます。", // ナイト
      "公正で独立した判断力により、真実を見極め正しい道を示すことができます。", // クイーン
      "論理的思考と道徳的権威で、公正な判断を下し他者を導くことができます。", // キング
    ]

    const swordsPositiveMeaningsEn = [
      "With clear thinking and sharp insight, you can find solutions to complex problems.", // Ace
      "You can make optimal choices with calm judgment and make balanced decisions.", // 2
      "You can overcome emotional pain and grow as a stronger and wiser person.", // 3
      "By taking necessary rest, you can recover your mind and body and store new energy.", // 4
      "You can learn from past conflicts and approach problem-solving with a more constructive approach.", // 5
      "You can escape from difficult situations and transition to a more peaceful and stable environment.", // 6
      "You can achieve goals with strategic thinking and use wisdom to avoid difficulties.", // 7
      "You can be freed from restrictive thinking and discover possibilities with new perspectives.", // 8
      "You can overcome anxiety and fear, correctly perceive reality, and move forward positively.", // 9
      "The complete end of difficult situations opens the path to new beginnings.", // 10
      "With sharp observation and curiosity, you can pursue truth and acquire new knowledge.", // Page
      "You can act quickly toward clear goals and overcome obstacles with intellectual power.", // Knight
      "With fair and independent judgment, you can discern truth and show the right path.", // Queen
      "With logical thinking and moral authority, you can make fair judgments and guide others.", // King
    ]

    const meanings = language === "en" ? swordsPositiveMeaningsEn : swordsPositiveMeaningsJa
    return (
      meanings[cardId - 50] ||
      (language === "en"
        ? "This card brings positive energy and opportunities for growth."
        : "このカードはポジティブなエネルギーと成長の機会をもたらします。")
    )
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesPositiveMeaningsJa = [
      "新しい物質的な機会が到来し、安定した基盤を築く絶好のチャンスを得られます。", // エース
      "複数の責任を巧みに管理し、変化する状況に柔軟に適応することができます。", // 2
      "チームワークを活かして高品質な成果を生み出し、共同作業で成功を収めます。", // 3
      "慎重な資源管理により、長期的な安定と安全を確保することができます。", // 4
      "困難な時期を乗り越えて、物質的・精神的な豊かさを回復することができます。", // 5
      "寛大な心で他者と資源を分かち合い、与えることの喜びを体験できます。", // 6
      "長期的な投資と忍耐強い努力により、将来の豊かな収穫を期待できます。", // 7
      "技術を磨き続けることで、専門性を高め高品質な仕事を成し遂げることができます。", // 8
      "自分の努力で築いた豊かさを享受し、独立した充実した生活を送ることができます。", // 9
      "世代を超えた豊かさと安定を築き、永続的な成功の基盤を確立できます。", // 10
      "新しい技術や知識を学ぶ機会に恵まれ、実践的なスキルを身につけることができます。", // ページ
      "着実で信頼性の高い行動により、確実に目標に向かって前進することができます。", // ナイト
      "物質的な豊かさを育み、安全で快適な環境を創造する能力を発揮できます。", // クイーン
      "ビジネスの成功と物質的な安定を築き、それを維持する優れた能力を示します。", // キング
    ]

    const pentaclesPositiveMeaningsEn = [
      "New material opportunities arrive, and you get an excellent chance to build a stable foundation.", // Ace
      "You can skillfully manage multiple responsibilities and flexibly adapt to changing situations.", // 2
      "You can produce high-quality results by utilizing teamwork and achieve success through collaboration.", // 3
      "Through careful resource management, you can ensure long-term stability and security.", // 4
      "You can overcome difficult times and recover material and spiritual abundance.", // 5
      "With a generous heart, you can share resources with others and experience the joy of giving.", // 6
      "Through long-term investment and patient effort, you can expect a rich future harvest.", // 7
      "By continuing to refine your skills, you can enhance your expertise and accomplish high-quality work.", // 8
      "You can enjoy the wealth built through your own efforts and live an independent and fulfilling life.", // 9
      "You can build wealth and stability that transcends generations and establish a foundation for lasting success.", // 10
      "You are blessed with opportunities to learn new skills and knowledge and can acquire practical skills.", // Page
      "Through steady and reliable action, you can surely move forward toward your goals.", // Knight
      "You can demonstrate the ability to nurture material wealth and create a safe and comfortable environment.", // Queen
      "You show excellent ability to build business success and material stability and maintain it.", // King
    ]

    const meanings = language === "en" ? pentaclesPositiveMeaningsEn : pentaclesPositiveMeaningsJa
    return (
      meanings[cardId - 64] ||
      (language === "en"
        ? "This card brings positive energy and opportunities for growth."
        : "このカードはポジティブなエネルギーと成長の機会をもたらします。")
    )
  }

  return language === "en"
    ? "This card brings positive energy and opportunities for growth."
    : "このカードはポジティブなエネルギーと成長の機会をもたらします。"
}

// カードのネガティブ解釈を取得する関数
export function getCardNegativeMeaning(cardId: number, language = "ja"): string {
  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    const wandsNegativeMeaningsJa = [
      "創造的なエネルギーが停滞し、新しいプロジェクトの開始が遅れる可能性があります。", // エース
      "計画性の欠如や優柔不断により、重要な機会を逃してしまう危険があります。", // 2
      "短期的な視野に囚われ、長期的な成功の機会を見逃してしまう可能性があります。", // 3
      "家庭や職場での不和により、安定した環境が脅かされる危険があります。", // 4
      "無益な争いや対立により、エネルギーが無駄に消費される可能性があります。", // 5
      "傲慢さや過信により、せっかくの成功が台無しになる危険があります。", // 6
      "圧倒的な困難に屈服し、諦めてしまう可能性があります。", // 7
      "性急すぎる行動により、重要な詳細を見落としてしまう危険があります。", // 8
      "疲労や燃え尽きにより、最後の一歩で挫折してしまう可能性があります。", // 9
      "過度な責任感により、重圧に押し潰されてしまう危険があります。", // 10
      "エネルギーが分散し、一つのことに集中できない状態になる可能性があります。", // ページ
      "衝動的な行動により、計画が台無しになってしまう危険があります。", // ナイト
      "要求が多すぎたり、攻撃的になることで人間関係が悪化する可能性があります。", // クイーン
      "独裁的な態度や短気により、周囲の信頼を失ってしまう危険があります。", // キング
    ]

    const wandsNegativeMeaningsEn = [
      "Creative energy stagnates, and the start of new projects may be delayed.", // Ace
      "Lack of planning or indecision may cause you to miss important opportunities.", // 2
      "Being trapped in short-term vision may cause you to miss long-term success opportunities.", // 3
      "Discord at home or work may threaten a stable environment.", // 4
      "Useless disputes or conflicts may waste energy unnecessarily.", // 5
      "Arrogance or overconfidence may ruin hard-earned success.", // 6
      "You may succumb to overwhelming difficulties and give up.", // 7
      "Too hasty actions may cause you to overlook important details.", // 8
      "Fatigue or burnout may cause you to stumble at the last step.", // 9
      "Excessive sense of responsibility may cause you to be crushed by pressure.", // 10
      "Energy may be dispersed, making it impossible to concentrate on one thing.", // Page
      "Impulsive actions may ruin plans.", // Knight
      "Being too demanding or aggressive may worsen relationships.", // Queen
      "Dictatorial attitude or short temper may cause you to lose the trust of those around you.", // King
    ]

    const meanings = language === "en" ? wandsNegativeMeaningsEn : wandsNegativeMeaningsJa
    return (
      meanings[cardId - 22] ||
      (language === "en"
        ? "Be mindful of potential challenges and approach situations with caution."
        : "潜在的な課題に注意し、慎重に状況に取り組むことが大切です。")
    )
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    const cupsNegativeMeaningsJa = [
      "感情的な不安定さや愛の欠如により、新しい関係の形成が困難になる可能性があります。", // エース
      "コミュニケーション不足や価値観の相違により、関係に亀裂が生じる危険があります。", // 2
      "過度な社交や表面的な関係により、真の友情を見失ってしまう可能性があります。", // 3
      "現状への不満や無関心により、新たな機会を見逃してしまう危険があります。", // 4
      "過去の失敗に囚われ、前向きな変化を受け入れられない状態になる可能性があります。", // 5
      "過去への執着や非現実的な期待により、現在の幸福を見逃してしまう危険があります。", // 6
      "現実逃避や優柔不断により、重要な決断を先延ばしにしてしまう可能性があります。", // 7
      "変化への恐怖により、成長の機会を逃してしまう危険があります。", // 8
      "物質主義や表面的な満足により、真の幸福を見失ってしまう可能性があります。", // 9
      "家族間の不和や価値観の対立により、調和が乱れる危険があります。", // 10
      "感情的な未熟さや依存により、健全な関係を築けない可能性があります。", // ページ
      "感情的な操作や嫉妬により、関係が悪化してしまう危険があります。", // ナイト
      "過度な自己犠牲や依存により、自分自身を見失ってしまう可能性があります。", // クイーン
      "感情的な操作や冷淡さにより、周囲との信頼関係が損なわれる危険があります。", // キング
    ]

    const cupsNegativeMeaningsEn = [
      "Emotional instability or lack of love may make it difficult to form new relationships.", // Ace
      "Lack of communication or differences in values may cause cracks in relationships.", // 2
      "Excessive socializing or superficial relationships may cause you to lose true friendship.", // 3
      "Dissatisfaction with the current situation or indifference may cause you to miss new opportunities.", // 4
      "Being trapped by past failures may make it impossible to accept positive changes.", // 5
      "Attachment to the past or unrealistic expectations may cause you to miss current happiness.", // 6
      "Escapism or indecision may cause you to postpone important decisions.", // 7
      "Fear of change may cause you to miss growth opportunities.", // 8
      "Materialism or superficial satisfaction may cause you to lose true happiness.", // 9
      "Family discord or conflicts in values may disturb harmony.", // 10
      "Emotional immaturity or dependence may make it impossible to build healthy relationships.", // Page
      "Emotional manipulation or jealousy may worsen relationships.", // Knight
      "Excessive self-sacrifice or dependence may cause you to lose yourself.", // Queen
      "Emotional manipulation or coldness may damage trust relationships with those around you.", // King
    ]

    const meanings = language === "en" ? cupsNegativeMeaningsEn : cupsNegativeMeaningsJa
    return (
      meanings[cardId - 36] ||
      (language === "en"
        ? "Be mindful of potential challenges and approach situations with caution."
        : "潜在的な課題に注意し、慎重に状況に取り組むことが大切です。")
    )
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    const swordsNegativeMeaningsJa = [
      "混乱した思考や誤った判断により、問題が複雑化してしまう可能性があります。", // エース
      "優柔不断や決断の先延ばしにより、重要な機会を逃してしまう危険があります。", // 2
      "感情的な痛みに囚われ、前向きな行動が取れなくなる可能性があります。", // 3
      "過度な休息や逃避により、必要な行動を怠ってしまう危険があります。", // 4
      "勝利への執着や競争心により、大切なものを失ってしまう可能性があります。", // 5
      "変化への抵抗や現状維持により、成長の機会を逃してしまう危険があります。", // 6
      "欺瞞や裏切りにより、信頼関係が損なわれてしまう可能性があります。", // 7
      "制限的な思考や被害者意識により、可能性を狭めてしまう危険があります。", // 8
      "過度な不安や恐怖により、現実を正しく認識できなくなる可能性があります。", // 9
      "完全な破綻や絶望により、立ち直ることが困難になる危険があります。", // 10
      "無謀な行動やゴシップにより、信頼を失ってしまう可能性があります。", // ページ
      "衝動的な行動や攻撃性により、関係が悪化してしまう危険があります。", // ナイト
      "冷酷さや感情の欠如により、人間関係が冷え込んでしまう可能性があります。", // クイーン
      "独裁的な態度や不寛容により、周囲から孤立してしまう危険があります。", // キング
    ]

    const swordsNegativeMeaningsEn = [
      "Confused thinking or wrong judgments may complicate problems.", // Ace
      "Indecision or postponing decisions may cause you to miss important opportunities.", // 2
      "Being trapped by emotional pain may make it impossible to take positive action.", // 3
      "Excessive rest or escapism may cause you to neglect necessary actions.", // 4
      "Attachment to victory or competitiveness may cause you to lose important things.", // 5
      "Resistance to change or maintaining the status quo may cause you to miss growth opportunities.", // 6
      "Deception or betrayal may damage trust relationships.", // 7
      "Restrictive thinking or victim mentality may narrow possibilities.", // 8
      "Excessive anxiety or fear may make it impossible to perceive reality correctly.", // 9
      "Complete breakdown or despair may make recovery difficult.", // 10
      "Reckless actions or gossip may cause you to lose trust.", // Page
      "Impulsive actions or aggression may worsen relationships.", // Knight
      "Ruthlessness or lack of emotion may cool relationships.", // Queen
      "Dictatorial attitude or intolerance may cause isolation from those around you.", // King
    ]

    const meanings = language === "en" ? swordsNegativeMeaningsEn : swordsNegativeMeaningsJa
    return (
      meanings[cardId - 50] ||
      (language === "en"
        ? "Be mindful of potential challenges and approach situations with caution."
        : "潜在的な課題に注意し、慎重に状況に取り組むことが大切です。")
    )
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    const pentaclesNegativeMeaningsJa = [
      "物質的な機会を逃したり、貪欲さにより大切なものを失ってしまう可能性があります。", // エース
      "優先順位の誤りや時間管理の失敗により、重要な責任を果たせなくなる危険があります。", // 2
      "チームワークの欠如や低品質な仕事により、信頼を失ってしまう可能性があります。", // 3
      "過度な節約や貪欲さにより、成長の機会を逃してしまう危険があります。", // 4
      "物質的な困窮や孤立により、助けを求めることができなくなる可能性があります。", // 5
      "不平等な関係や見返りを求める態度により、真の絆が築けない危険があります。", // 6
      "短期的な思考や焦りにより、長期的な成功を台無しにしてしまう可能性があります。", // 7
      "怠惰や完璧主義により、実際の成果を上げられなくなる危険があります。", // 8
      "物質的な依存や虚栄心により、真の価値を見失ってしまう可能性があります。", // 9
      "家族間の争いや財政的な失敗により、安定が脅かされる危険があります。", // 10
      "浪費や怠惰により、せっかくの機会を無駄にしてしまう可能性があります。", // ページ
      "過度な慎重さや頑固さにより、必要な変化を受け入れられない危険があります。", // ナイト
      "物質主義や嫉妬により、人間関係が悪化してしまう可能性があります。", // クイーン
      "貪欲さや頑固さにより、周囲との協調性を失ってしまう危険があります。", // キング
    ]

    const pentaclesNegativeMeaningsEn = [
      "You may miss material opportunities or lose important things due to greed.", // Ace
      "Wrong priorities or failure in time management may make it impossible to fulfill important responsibilities.", // 2
      "Lack of teamwork or low-quality work may cause you to lose trust.", // 3
      "Excessive saving or greed may cause you to miss growth opportunities.", // 4
      "Material poverty or isolation may make it impossible to seek help.", // 5
      "Unequal relationships or attitudes seeking returns may prevent building true bonds.", // 6
      "Short-term thinking or impatience may ruin long-term success.", // 7
      "Laziness or perfectionism may prevent achieving actual results.", // 8
      "Material dependence or vanity may cause you to lose true value.", // 9
      "Family disputes or financial failures may threaten stability.", // 10
      "Waste or laziness may cause you to waste precious opportunities.", // Page
      "Excessive caution or stubbornness may prevent accepting necessary changes.", // Knight
      "Materialism or jealousy may worsen relationships.", // Queen
      "Greed or stubbornness may cause you to lose cooperation with those around you.", // King
    ]

    const meanings = language === "en" ? pentaclesNegativeMeaningsEn : pentaclesNegativeMeaningsJa
    return (
      meanings[cardId - 64] ||
      (language === "en"
        ? "Be mindful of potential challenges and approach situations with caution."
        : "潜在的な課題に注意し、慎重に状況に取り組むことが大切です。")
    )
  }

  return language === "en"
    ? "Be mindful of potential challenges and approach situations with caution."
    : "潜在的な課題に注意し、慎重に状況に取り組むことが大切です。"
}
