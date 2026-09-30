scoreboard objectives add spiral_sword dummy
scoreboard objectives add spiral_sword2 dummy
scoreboard objectives add spiral_sword3 dummy
scoreboard objectives add spiral_sword4 dummy
scoreboard players add @p[tag=shoot_small_fireball] spiral_sword4 1
scoreboard players add @p[tag=shoot_spiral_magic] spiral_sword3 1
scoreboard players add @p[tag=shoot_arrow] spiral_sword2 1
scoreboard players add @p[tag=shoot_snowball] spiral_sword 1
execute at @p[scores={spiral_sword=30}] positioned ~ ~ ~ run tag @p remove shoot_snowball
execute at @p[scores={spiral_sword2=35}] positioned ~ ~ ~ run tag @p remove shoot_arrow
execute at @p[scores={spiral_sword3=30}] positioned ~ ~ ~ run tag @p remove shoot_spiral_magic
execute at @p[scores={spiral_sword4=30}] positioned ~ ~ ~ run tag @p remove shoot_small_fireball
execute at @p[scores={spiral_sword=30}] positioned ~ ~ ~ run scoreboard players set @s spiral_sword 0
execute at @p[scores={spiral_sword2=35}] positioned ~ ~ ~ run scoreboard players set @s spiral_sword2 0
execute at @p[scores={spiral_sword3=30}] positioned ~ ~ ~ run scoreboard players set @s spiral_sword3 0
execute at @p[scores={spiral_sword4=30}] positioned ~ ~ ~ run scoreboard players set @s spiral_sword4 0