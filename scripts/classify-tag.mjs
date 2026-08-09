const CATEGORY_RULES = [
  ['subject', 'count', [/^(solo|\d+(girls|boys|people)|multiple_(girls|boys)|group|duo|trio|sextuplets|twins)$/]]],
  ['hair', 'length', [/(^|_)(bald|very_short|short|medium|long|very_long|absurdly_long)_hair$/]]],
  ['hair', 'color', [/^(black|brown|blonde|blue|green|pink|purple|red|white|grey|gray|silver|orange|yellow|aqua|cyan|teal|multicolored)_hair$/]],
  ['hair', 'hairstyle', [/(ponytail|twintails|braid|braids|bun|bob|pixie|hime_cut|drill_hair|spiked_hair)/]],
  ['hair', 'bangs', [/(bangs|sidelocks|hair_between_eyes|hair_over_(one|both)_eyes|parted_bangs)/]],
  ['hair', 'condition-motion', [/(wet_hair|floating_hair|hair_flaps|messy_hair|windblown_hair)/]],
  ['hair', 'details', [/(gradient_hair|streaked_hair|two-tone_hair|multicolored_hair)/]],
  ['eyes', 'color', [/^(blue|red|green|brown|purple|yellow|pink|black|grey|gray|aqua|orange)_eyes$/]],
  ['eyes', 'color', [/^(heterochromia|mismatched_pupils)$/]],
  ['eyes', 'state', [/(closed_eyes|half-closed_eyes|one_eye_closed|wide-eyed|narrowed_eyes)/]],
  ['eyes', 'pupils', [/pupil/]],
  ['eyes', 'effects', [/(glowing_eyes|flaming_eyes|bloodshot_eyes|colored_sclera|no_eyes|eyeless)/]],
  ['face', 'mouth', [/(open_mouth|closed_mouth|parted_lips|tongue_out|pursed_lips)/]],
  ['face', 'teeth-tongue', [/(fangs|fang|teeth|long_tongue|forked_tongue)/]],
  ['face', 'makeup', [/(makeup|lipstick|eyeshadow|eyeliner|blush)/]],
  ['face', 'markings', [/(freckles|mole|facial_mark|face_mark|scar|tattoo|piercing)/]],
  ['head', 'eyewear', [/(glasses|sunglasses|eyepatch|monocle|goggles)/]],
  ['head', 'headwear', [/(hat|cap|beret|helmet|hood|crown|tiara|headband|bonnet|sombrero)/]],
  ['head', 'ears', [/(cat_ears|fox_ears|wolf_ears|rabbit_ears|dog_ears|animal_ears|pointy_ears|elf_ears)/]],
  ['head', 'horns', [/(horns|horned|sheep_horns|demon_horns|dragon_horns)/]],
  ['head', 'supernatural-features', [/(halo|antennae|third_eye|floating_(object|halo))/]],
  ['body', 'build', [/(skinny|slender|slim|petite|curvy|muscular|toned|plump|chubby|tall|shortstack)/]],
  ['body', 'chest', [/(flat_chest|small_breasts|medium_breasts|large_breasts|huge_breasts)/]],
  ['body', 'torso', [/(narrow_waist|waist|navel|midriff|stomach|cleavage|collarbone|covered_navel)/]],
  ['body', 'arms-hands', [/(arms|hands|fingers|fingernails|nail_polish|multiple_arms|mechanical_arms)/]],
  ['body', 'legs-feet', [/(thighs|thick_thighs|legs|long_legs|knees|calves|feet|toes|knees_up)/]],
  ['body', 'skin', [/(pale_skin|dark_skin|tan|tanned|shiny_skin|sweaty|wet_skin)/]],
  ['body', 'body-details', [/(tattoo|scar|bandages|birthmark|markings)/]],
  ['appendages', 'wings', [/(wings|angel_wings|bat_wings|bird_wings|fairy_wings|mechanical_wings)/]],
  ['appendages', 'tails', [/(tail|tails|multiple_tails|fox_tail|cat_tail|dragon_tail|pig_tail|raccoon_tail|intertwined_tails)/]],
  ['appendages', 'extra-limbs', [/(tentacles|extra_arms|multiple_arms|extra_legs)/]],
  ['appendages', 'creature-anatomy', [/(claws|paws|hooves|scales|feathers|fur|furry|fins)/]],
  ['expression', 'positive', [/^(smile|grin|happy|light_smile|smirk|laughing)$/]],
  ['expression', 'neutral', [/(expressionless|serious|sleepy|confused|bored|focused)/]],
  ['expression', 'negative', [/(crying|angry|sad|scared|fear|tears)/]],
  ['expression', 'reactive', [/(embarrassed|surprised|pout|blush|sweatdrop)/]],
  ['expression', 'intense', [/(ahegao|screaming|scream|naughty_face)/]],
  ['upper-clothing', 'tops', [/(shirt|blouse|t-shirt|tank_top|crop_top|tube_top|halter_top|bodysuit|leotard)/]],
  ['upper-clothing', 'sleeves', [/(sleeveless|short_sleeves|long_sleeves|puffy_sleeves|detached_sleeves|wide_sleeves)/]],
  ['upper-clothing', 'collars', [/(collar|turtleneck|sailor_collar|off-shoulder|halter)/]],
  ['upper-clothing', 'outerwear', [/(jacket|coat|blazer|cardigan|sweater|hoodie|cape|cloak|vest)/]],
  ['upper-clothing', 'clothing-state', [/(open_clothes|open_jacket|partially_open|torn_clothes|wet_clothes|partially_undressed|no_shirt)/]],
  ['lower-clothing', 'skirts', [/(skirt|miniskirt|pleated_skirt|pencil_skirt|showgirl_skirt)/]],
  ['lower-clothing', 'pants', [/(pants|jeans|trousers|leggings|cargo_pants)/]],
  ['lower-clothing', 'shorts', [/(shorts|short_shorts|bike_shorts)/]],
  ['lower-clothing', 'legwear', [/(socks|kneehighs|thighhighs|stockings|pantyhose|garter)/]],
  ['lower-clothing', 'legwear-properties', [/(striped_socks|print_socks|white_pantyhose|black_pantyhose|lace_stockings)/]],
  ['outfits', 'dresses', [/(dress|sundress|wedding_dress|china_dress|qipao)/]],
  ['outfits', 'uniforms', [/(uniform|school_uniform|military_uniform|nurse|maid)/]],
  ['outfits', 'traditional', [/(kimono|yukata|hakama|hanfu|qipao|cheongsam)/]],
  ['outfits', 'fantasy-roles', [/(magical_girl|witch|idol|maid|nurse|race_queen|cosplay)/]],
  ['outfits', 'fashion-styles', [/(gothic|lolita|casual|formal|gothic_lolita|street_fashion)/]],
  ['accessories-props', 'jewelry', [/(necklace|earrings|bracelet|rings|choker|brooch|gemstone|piercing)/]],
  ['accessories-props', 'hair-accessories', [/(hairclip|hair_ornament|hairband|hair_bow|ribbon|hat_ribbon)/]],
  ['accessories-props', 'bags', [/(bag|backpack|handbag|school_bag|pouch)/]],
  ['accessories-props', 'held-objects', [/(holding_|carrying_|phone|book|microphone|umbrella|food|flower|chopsticks)/]],
  ['accessories-props', 'weapons', [/(sword|gun|rifle|bow|polearm|staff|knife|weapon|whip|machine_gun)/]],
  ['accessories-props', 'misc-props', [/(furniture|couch|bed|toy|instrument|tool|watch|smartwatch|lanyard)/]],
  ['pose-action', 'stance', [/(standing|sitting|kneeling|lying|crouching|prone|squatting)/]],
  ['pose-action', 'body-position', [/(arms_up|arm_raised|hands_on_hips|legs_apart|legs_crossed|knees_up|head_tilt)/]],
  ['pose-action', 'hand-gestures', [/(pointing|peace_sign|thumbs_up|thumbs_down|waving|finger_to_mouth)/]],
  ['pose-action', 'interaction', [/(holding|touching|hugging|kissing|carrying|shared_earphones|hand_on_another)/]],
  ['pose-action', 'actions', [/(walking|running|jumping|dancing|eating|drinking|sleeping|fighting|yoga|twerking)/]],
  ['composition', 'shot', [/(full_body|upper_body|cowboy_shot|portrait|close-up|closeup|extreme_closeup)/]],
  ['composition', 'camera-angle', [/(from_behind|from_side|from_above|from_below|three-quarter|dutch_angle)/]],
  ['composition', 'gaze', [/(looking_at_viewer|looking_away|looking_back|looking_to_the_side)/]],
  ['composition', 'crop', [/(cropped_|out_of_frame|outside_border|border)/]],
  ['composition', 'perspective', [/(perspective|foreshortening|wide_angle|fisheye)/]],
  ['environment', 'location', [/(indoors|outdoors|street|bedroom|classroom|bathroom|kitchen|office|beach|forest|rooftop|garage)/]],
  ['environment', 'architecture', [/(architecture|building|traditional_architecture|japanese_architecture|ruins|futuristic)/]],
  ['environment', 'nature', [/(sky|clouds|tree|trees|flowers|water|mountain|snow|scenery)/]],
  ['environment', 'time', [/(day|night|morning|evening|sunset|night_sky)/]],
  ['environment', 'weather', [/(rain|snow|fog|storm|sunny|cloudy)/]],
  ['environment', 'season', [/(spring|summer|autumn|fall|winter)/]],
  ['environment', 'environmental-objects', [/(window|door|bed|couch|table|vehicle|car|train)/]],
  ['lighting-rendering', 'light-source', [/(sunlight|moonlight|candlelight|window_light|artificial_light|firelight|neon)/]],
  ['lighting-rendering', 'direction', [/(backlighting|sidelighting|underlighting|rim_lighting|top_lighting)/]],
  ['lighting-rendering', 'quality', [/(soft_light|hard_light|dramatic_lighting|cinematic_lighting|dim_lighting|volumetric)/]],
  ['lighting-rendering', 'effects', [/(shadow|shadows|depth_of_field|bokeh|lens_flare|light_rays|god_rays|sparkle|particles|glow)/]],
  ['lighting-rendering', 'rendering-visual-style', [/(monochrome|greyscale|grayscale|blurry|silhouette|sketch|lineart|painterly|pixel_art|chibi)/]]
];

export function classifyTag(tag) {
  const normalized = tag.toLowerCase();
  for (const [category, domain, patterns] of CATEGORY_RULES) {
    if (patterns.some((pattern) => pattern.test(normalized))) return { category, domain, confidence: 0.92, method: 'rule' };
  }
  return null;
}

export function classifySpecialSourceGroup(group) {
  if (group === 'characters') return { category: 'subject', domain: 'character-identity', confidence: 1, method: 'source-group' };
  if (group === 'series') return { category: 'subject', domain: 'character-identity', confidence: 1, method: 'source-group' };
  if (group === 'artists') return { category: 'subject', domain: 'character-identity', confidence: 1, method: 'source-group' };
  if (group === 'meta') return { category: 'lighting-rendering', domain: 'rendering-visual-style', confidence: 0.5, method: 'source-group-review' };
  return null;
}
