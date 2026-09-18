package com.mahmoudenglish.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.ui.theme.Emerald800
import com.mahmoudenglish.app.ui.theme.Stone400

data class NavTabItem(
    val id: String,
    val title: String,
    val icon: ImageVector
)

@Composable
fun BottomNavBar(
    currentTab: String,
    onTabSelected: (String) -> Unit
) {
    val tabs = listOf(
        NavTabItem("camera", "الكاميرا", Icons.Default.CameraAlt),
        NavTabItem("vocab", "الكلمات", Icons.Default.MenuBook),
        NavTabItem("chat", "شات ذكي", Icons.Default.ChatBubbleOutline),
        NavTabItem("lessons", "الدروس", Icons.Default.School),
        NavTabItem("game", "التحدي", Icons.Default.SportsEsports),
        NavTabItem("tips", "نصائح", Icons.Default.Lightbulb)
    )

    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        shadowElevation = 8.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(vertical = 6.dp, horizontal = 4.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            tabs.forEach { tab ->
                val isSelected = currentTab == tab.id
                Column(
                    horizontalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onTabSelected(tab.id) }
                        .padding(horizontal = 6.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isSelected) Emerald800 else androidx.compose.ui.graphics.Color.Transparent
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = tab.icon,
                            contentDescription = tab.title,
                            tint = if (isSelected) androidx.compose.ui.graphics.Color.White else Stone400,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Text(
                        text = tab.title,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) Emerald800 else Stone400,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }
    }
}
