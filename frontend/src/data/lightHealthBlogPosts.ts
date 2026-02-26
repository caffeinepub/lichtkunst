export interface StaticBlogPost {
  id: string;
  title: string;
  content: string;
  publicationDate: bigint;
}

export const lightHealthBlogPosts: StaticBlogPost[] = [
  {
    id: 'static-light-health-1',
    title: 'Die Wissenschaft des Lichts: Wellenlängen und ihre Eigenschaften',
    content: `Licht ist nicht einfach nur Licht – es besteht aus verschiedenen Wellenlängen, die jeweils unterschiedliche Eigenschaften und Auswirkungen auf unseren Körper haben. Das sichtbare Lichtspektrum reicht von etwa 380 Nanometern (violett) bis 780 Nanometern (rot).

Blaues Licht hat eine kurze Wellenlänge zwischen 380 und 500 Nanometern. Diese kurzen Wellen tragen mehr Energie und können tiefer in das Auge eindringen. Blaues Licht ist besonders präsent in LED-Bildschirmen, Smartphones und modernen Beleuchtungssystemen.

Rotes Licht hingegen hat eine längere Wellenlänge zwischen 620 und 780 Nanometern. Diese längeren Wellen tragen weniger Energie und werden sanfter vom Auge verarbeitet. Rotes Licht findet sich natürlicherweise im Sonnenuntergang und in speziellen therapeutischen Lichtquellen.

Die Energiedifferenz zwischen diesen Wellenlängen ist entscheidend: Je kürzer die Wellenlänge, desto höher die Energie. Diese physikalische Eigenschaft hat direkte Auswirkungen auf unsere Augengesundheit und unser Wohlbefinden.

Historisch gesehen haben Menschen über Jahrtausende hauptsächlich natürliches Licht erlebt – mit einem hohen Anteil an rotem Licht während der Morgen- und Abenddämmerung. Unsere Augen sind evolutionär an dieses Lichtspektrum angepasst.`,
    publicationDate: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: 'static-light-health-2',
    title: 'Blaues Licht und seine Auswirkungen auf die Augengesundheit',
    content: `In unserer modernen digitalen Welt sind wir ständig blauem Licht ausgesetzt. Doch was macht dieses hochenergetische Licht mit unseren Augen?

Blaues Licht kann die Netzhaut belasten. Studien zeigen, dass langfristige Exposition gegenüber blauem Licht oxidativen Stress in den Photorezeptorzellen verursachen kann. Dies kann zu vorzeitiger Ermüdung der Augen führen und langfristig das Risiko für Makuladegeneration erhöhen.

Die Symptome der digitalen Augenbelastung sind vielen bekannt: trockene Augen, verschwommenes Sehen, Kopfschmerzen und Nackenschmerzen. Diese Beschwerden werden durch die intensive Exposition gegenüber blauem Licht von Bildschirmen verstärkt.

Besonders problematisch ist blaues Licht am Abend. Es unterdrückt die Produktion von Melatonin, unserem Schlafhormon, stärker als jede andere Wellenlänge. Dies kann zu Schlafstörungen führen und den natürlichen zirkadianen Rhythmus durcheinanderbringen.

Kinder sind besonders gefährdet, da ihre Augenlinsen noch klarer sind und mehr blaues Licht zur Netzhaut durchlassen. Die zunehmende Bildschirmzeit bei jungen Menschen ist daher ein wachsendes gesundheitliches Anliegen.

Während blaues Licht tagsüber durchaus positive Effekte haben kann – es steigert Aufmerksamkeit und Stimmung – überwiegen bei übermäßiger Exposition die negativen Auswirkungen deutlich.`,
    publicationDate: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: 'static-light-health-3',
    title: 'Rotes Licht: Die sanfte Alternative für gesunde Augen',
    content: `Rotes Licht wird zunehmend als therapeutische Alternative zu herkömmlicher Beleuchtung erkannt. Seine einzigartigen Eigenschaften machen es zur idealen Wahl für augenfreundliche Beleuchtung.

Die längeren Wellenlängen des roten Lichts tragen weniger Energie und verursachen daher weniger oxidativen Stress in den Augen. Studien zeigen, dass rotes Licht die Mitochondrienfunktion in den Zellen der Netzhaut unterstützen kann, was zu einer verbesserten Zellgesundheit führt.

Ein entscheidender Vorteil: Rotes Licht unterdrückt die Melatoninproduktion kaum. Das bedeutet, dass Sie abends rotes Licht verwenden können, ohne Ihren Schlaf-Wach-Rhythmus zu stören. Viele Menschen berichten von besserem Schlaf, wenn sie abends auf rote Beleuchtung umsteigen.

Rotes Licht reduziert die Augenbelastung erheblich. Bei längerer Bildschirmarbeit oder Lesen kann die Verwendung von rotem Licht oder Rotlichtfiltern die Ermüdung der Augen deutlich verringern. Die Augen müssen weniger hart arbeiten, um das Licht zu verarbeiten.

In der Lichttherapie wird rotes Licht bereits erfolgreich eingesetzt. Es kann die Durchblutung verbessern, Entzündungen reduzieren und sogar die Regeneration von Gewebe fördern. Diese positiven Effekte erstrecken sich auch auf das empfindliche Gewebe unserer Augen.

Künstler wie Istvan Seidel nutzen bewusst rotes Licht in ihren Werken – nicht nur aus ästhetischen Gründen, sondern auch weil es eine angenehmere, entspannendere Atmosphäre schafft, die unsere Augen schont.`,
    publicationDate: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: 'static-light-health-4',
    title: 'Praktische Empfehlungen: Warum rotes Licht die bessere Wahl ist',
    content: `Nach der Betrachtung der wissenschaftlichen Fakten wird deutlich: Rotes Licht ist die gesündere Wahl für unsere Augen. Hier sind praktische Empfehlungen für den Alltag.

Für die Abendbeleuchtung sollten Sie auf rotes oder bernsteinfarbenes Licht umsteigen. Dies schützt Ihren Schlafrhythmus und reduziert die Belastung Ihrer Augen nach einem langen Tag. Spezielle Rotlichtlampen oder dimmbare LED-Leuchten mit Warmweißeinstellung sind ideal.

Bei der Bildschirmarbeit können Blaulichtfilter helfen, aber noch besser ist es, die Bildschirmzeit zu reduzieren und regelmäßige Pausen einzulegen. Einige Geräte bieten einen "Nachtmodus", der den Blaulichtanteil reduziert – nutzen Sie diese Funktion, besonders am Abend.

Für Leselampen ist warmes, rötliches Licht die beste Wahl. Es bietet ausreichend Helligkeit zum Lesen, ohne die Augen zu überanstrengen. Vermeiden Sie kaltweiße LED-Lampen mit hohem Blaulichtanteil beim Lesen vor dem Schlafengehen.

In Arbeitsräumen kann eine Kombination sinnvoll sein: Tagsüber neutralweißes Licht für Konzentration und Produktivität, am Nachmittag und Abend dann ein Wechsel zu wärmerem, rötlichem Licht zur Vorbereitung auf die Nachtruhe.

Die Investition in augenfreundliche Beleuchtung zahlt sich langfristig aus. Weniger Augenbelastung bedeutet weniger Kopfschmerzen, besseren Schlaf und möglicherweise ein geringeres Risiko für altersbedingte Augenerkrankungen.

Fazit: Rotes Licht ist nicht nur angenehmer für unsere Augen – es ist wissenschaftlich erwiesen die gesündere Alternative zu blauem Licht. Ob in der Kunst, wie bei Istvan Seidels Lichtinstallationen, oder im Alltag: Rotes Licht schont unsere Augen und fördert unser Wohlbefinden.`,
    publicationDate: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
];
