scoreboard players add @s[hasitem={item=bls:cobsidian_leggings,location=slot.armor.legs},tag=!obsidian_legs] obsidian 1
scoreboard players add @s[hasitem={item=bls:cobsidian_chestplate,location=slot.armor.chest},tag=!obsidian_chest] obsidian 1
scoreboard players add @s[hasitem={item=bls:cobsidian_helmet,location=slot.armor.head},tag=!obsidian_head] obsidian 1

tag @s[hasitem={item=bls:cobsidian_leggings,location=slot.armor.legs}] add obsidian_legs
tag @s[hasitem={item=bls:cobsidian_chestplate,location=slot.armor.chest}] add obsidian_chest
tag @s[hasitem={item=bls:cobsidian_helmet,location=slot.armor.head}] add obsidian_head

scoreboard players remove @s[hasitem={item=bls:cobsidian_leggings,location=slot.armor.legs,quantity=0},tag=obsidian_legs] obsidian 1
scoreboard players remove @s[hasitem={item=bls:cobsidian_chestplate,location=slot.armor.chest,quantity=0},tag=obsidian_chest] obsidian 1
scoreboard players remove @s[hasitem={item=bls:cobsidian_helmet,location=slot.armor.head,quantity=0},tag=obsidian_head] obsidian 1

tag @s[hasitem={item=bls:cobsidian_leggings,location=slot.armor.legs,quantity=0},tag=obsidian_legs] remove obsidian_legs
tag @s[hasitem={item=bls:cobsidian_chestplate,location=slot.armor.chest,quantity=0},tag=obsidian_chest] remove obsidian_chest
tag @s[hasitem={item=bls:cobsidian_helmet,location=slot.armor.head,quantity=0},tag=obsidian_head] remove obsidian_head

# boots no longer count toward the obsidian resistance set; reset when no piece is worn
scoreboard players set @s[tag=!obsidian_head,tag=!obsidian_chest,tag=!obsidian_legs] obsidian 0


scoreboard players add @s[hasitem={item=bls:slime_boots,location=slot.armor.feet},tag=!slime_boots] slime 1
scoreboard players add @s[hasitem={item=bls:slime_leggings,location=slot.armor.legs},tag=!slime_legs] slime 1
scoreboard players add @s[hasitem={item=bls:slime_chestplate,location=slot.armor.chest},tag=!slime_chest] slime 1
scoreboard players add @s[hasitem={item=bls:slime_helmet,location=slot.armor.head},tag=!slime_head] slime 1

tag @s[hasitem={item=bls:slime_boots,location=slot.armor.feet}] add slime_boots
tag @s[hasitem={item=bls:slime_leggings,location=slot.armor.legs}] add slime_legs
tag @s[hasitem={item=bls:slime_chestplate,location=slot.armor.chest}] add slime_chest
tag @s[hasitem={item=bls:slime_helmet,location=slot.armor.head}] add slime_head

scoreboard players remove @s[hasitem={item=bls:slime_boots,location=slot.armor.feet,quantity=0},tag=slime_boots] slime 1
scoreboard players remove @s[hasitem={item=bls:slime_leggings,location=slot.armor.legs,quantity=0},tag=slime_legs] slime 1
scoreboard players remove @s[hasitem={item=bls:slime_chestplate,location=slot.armor.chest,quantity=0},tag=slime_chest] slime 1
scoreboard players remove @s[hasitem={item=bls:slime_helmet,location=slot.armor.head,quantity=0},tag=slime_head] slime 1

tag @s[hasitem={item=bls:slime_boots,location=slot.armor.feet,quantity=0},tag=slime_boots] remove slime_boots
tag @s[hasitem={item=bls:slime_leggings,location=slot.armor.legs,quantity=0},tag=slime_legs] remove slime_legs
tag @s[hasitem={item=bls:slime_chestplate,location=slot.armor.chest,quantity=0},tag=slime_chest] remove slime_chest
tag @s[hasitem={item=bls:slime_helmet,location=slot.armor.head,quantity=0},tag=slime_head] remove slime_head


scoreboard players add @s[hasitem={item=bls:prismarine_boots,location=slot.armor.feet},tag=!prismarine_boots] prismarine 1
scoreboard players add @s[hasitem={item=bls:prismarine_leggings,location=slot.armor.legs},tag=!prismarine_legs] prismarine 1
scoreboard players add @s[hasitem={item=bls:prismarine_chestplate,location=slot.armor.chest},tag=!prismarine_chest] prismarine 1
scoreboard players add @s[hasitem={item=bls:prismarine_helmet,location=slot.armor.head},tag=!prismarine_head] prismarine 1

tag @s[hasitem={item=bls:prismarine_boots,location=slot.armor.feet}] add prismarine_boots
tag @s[hasitem={item=bls:prismarine_leggings,location=slot.armor.legs}] add prismarine_legs
tag @s[hasitem={item=bls:prismarine_chestplate,location=slot.armor.chest}] add prismarine_chest
tag @s[hasitem={item=bls:prismarine_helmet,location=slot.armor.head}] add prismarine_head

scoreboard players remove @s[hasitem={item=bls:prismarine_boots,location=slot.armor.feet,quantity=0},tag=prismarine_boots] prismarine 1
scoreboard players remove @s[hasitem={item=bls:prismarine_leggings,location=slot.armor.legs,quantity=0},tag=prismarine_legs] prismarine 1
scoreboard players remove @s[hasitem={item=bls:prismarine_chestplate,location=slot.armor.chest,quantity=0},tag=prismarine_chest] prismarine 1
scoreboard players remove @s[hasitem={item=bls:prismarine_helmet,location=slot.armor.head,quantity=0},tag=prismarine_head] prismarine 1

tag @s[hasitem={item=bls:prismarine_boots,location=slot.armor.feet,quantity=0},tag=prismarine_boots] remove prismarine_boots
tag @s[hasitem={item=bls:prismarine_leggings,location=slot.armor.legs,quantity=0},tag=prismarine_legs] remove prismarine_legs
tag @s[hasitem={item=bls:prismarine_chestplate,location=slot.armor.chest,quantity=0},tag=prismarine_chest] remove prismarine_chest
tag @s[hasitem={item=bls:prismarine_helmet,location=slot.armor.head,quantity=0},tag=prismarine_head] remove prismarine_head



scoreboard players add @s[hasitem={item=bls:glowstone_boots,location=slot.armor.feet},tag=!glowstone_boots] glowstone 1
scoreboard players add @s[hasitem={item=bls:glowstone_leggings,location=slot.armor.legs},tag=!glowstone_legs] glowstone 1
scoreboard players add @s[hasitem={item=bls:glowstone_chestplate,location=slot.armor.chest},tag=!glowstone_chest] glowstone 1
scoreboard players add @s[hasitem={item=bls:glowstone_helmet,location=slot.armor.head},tag=!glowstone_head] glowstone 1

tag @s[hasitem={item=bls:glowstone_boots,location=slot.armor.feet}] add glowstone_boots
tag @s[hasitem={item=bls:glowstone_leggings,location=slot.armor.legs}] add glowstone_legs
tag @s[hasitem={item=bls:glowstone_chestplate,location=slot.armor.chest}] add glowstone_chest
tag @s[hasitem={item=bls:glowstone_helmet,location=slot.armor.head}] add glowstone_head

scoreboard players remove @s[hasitem={item=bls:glowstone_boots,location=slot.armor.feet,quantity=0},tag=glowstone_boots] glowstone 1
scoreboard players remove @s[hasitem={item=bls:glowstone_leggings,location=slot.armor.legs,quantity=0},tag=glowstone_legs] glowstone 1
scoreboard players remove @s[hasitem={item=bls:glowstone_chestplate,location=slot.armor.chest,quantity=0},tag=glowstone_chest] glowstone 1
scoreboard players remove @s[hasitem={item=bls:glowstone_helmet,location=slot.armor.head,quantity=0},tag=glowstone_head] glowstone 1

tag @s[hasitem={item=bls:glowstone_boots,location=slot.armor.feet,quantity=0},tag=glowstone_boots] remove glowstone_boots
tag @s[hasitem={item=bls:glowstone_leggings,location=slot.armor.legs,quantity=0},tag=glowstone_legs] remove glowstone_legs
tag @s[hasitem={item=bls:glowstone_chestplate,location=slot.armor.chest,quantity=0},tag=glowstone_chest] remove glowstone_chest
tag @s[hasitem={item=bls:glowstone_helmet,location=slot.armor.head,quantity=0},tag=glowstone_head] remove glowstone_head



