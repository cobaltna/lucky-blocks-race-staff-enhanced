scoreboard objectives add ice dummy
scoreboard players set @s ice 0
scoreboard objectives add slime dummy
scoreboard players set @s slime 0
scoreboard objectives add obsidian dummy
scoreboard players set @s obsidian 0
scoreboard objectives add glowstone dummy
scoreboard players set @s glowstone 0
scoreboard objectives add prismarine dummy
scoreboard players set @s prismarine 0
scoreboard objectives add lapis dummy
scoreboard players set @s lapis 0
scoreboard objectives add magma dummy
scoreboard players set @s magma 0
scoreboard objectives add mushroom_cooldown dummy
scoreboard players set @s mushroom_cooldown 0
tag @s remove helmet
tag @s remove chest
tag @s remove legs
tag @s remove boots
# 复活时同时清掉盔甲检测用的标签，否则计分板已归零但标签还在，
# 下次进入 armors 时 hasitem+tag=!xxx 不成立，计数不再累加，套装效果就永久丢失
tag @s remove obsidian_head
tag @s remove obsidian_chest
tag @s remove obsidian_legs
tag @s remove slime_head
tag @s remove slime_chest
tag @s remove slime_legs
tag @s remove slime_boots
tag @s remove prismarine_helmet
tag @s remove prismarine_chestplate
tag @s remove prismarine_leggings
tag @s remove prismarine_boots
tag @s remove glowstone_head
tag @s remove glowstone_chest
tag @s remove glowstone_leggings
tag @s remove glowstone_boots