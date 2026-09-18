package com.mahmoudenglish.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.model.ThemeStyle
import com.mahmoudenglish.app.model.UserProgress
import com.mahmoudenglish.app.ui.theme.*

@Composable
fun AppHeader(
    theme: ThemeStyle,
    onThemeChange: (ThemeStyle) -> Unit,
    progress: UserProgress,
    isVoiceAssistActive: Boolean,
    onToggleVoiceAssist: () -> Unit,
    onOpenMemoryModal: () -> Unit,
    onLogoWelcomeSpeech: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f),
        tonalElevation = 2.dp,
        shadowElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Left: Logo & Brand
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(Emerald800)
                            .clickable { onLogoWelcomeSpeech() },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "M",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 22.sp,
                            fontFamily = FontFamily.Serif
                        )
                        // Tiny audio indicator dot
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .align(Alignment.BottomEnd)
                                .clip(CircleShape)
                                .background(Amber500)
                        )
                    }

                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "Mahmoud English",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Serif,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Emerald100,
                                modifier = Modifier.padding(horizontal = 2.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(Emerald700)
                                    )
                                    Text(
                                        text = "ناطق ومصور",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Emerald950
                                    )
                                }
                            }
                        }
                        Text(
                            text = "ترجمة بالكاميرا • قاموس ناطق • دروس واختبارات",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Right: Controls
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Voice Assist Toggle
                    IconButton(
                        onClick = onToggleVoiceAssist,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isVoiceAssistActive) Emerald800 else MaterialTheme.colorScheme.surfaceVariant
                            )
                    ) {
                        Icon(
                            imageVector = if (isVoiceAssistActive) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                            contentDescription = "الوضع الصوتي",
                            tint = if (isVoiceAssistActive) Color.White else Stone500,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Streak Badge
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Amber100,
                        modifier = Modifier.height(30.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 8.dp),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = "Streak",
                                tint = Amber800,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "${progress.streakDays} يوم",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Amber900
                            )
                        }
                    }

                    // Theme Selector Dropdown / Cycle
                    IconButton(
                        onClick = {
                            val nextTheme = when (theme) {
                                ThemeStyle.SAGE_CREAM -> ThemeStyle.WARM_PARCHMENT
                                ThemeStyle.WARM_PARCHMENT -> ThemeStyle.NIGHT_FOREST
                                ThemeStyle.NIGHT_FOREST -> ThemeStyle.SAGE_CREAM
                            }
                            onThemeChange(nextTheme)
                        },
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Icon(
                            imageVector = when (theme) {
                                ThemeStyle.SAGE_CREAM -> Icons.Default.WbSunny
                                ThemeStyle.WARM_PARCHMENT -> Icons.Default.MenuBook
                                ThemeStyle.NIGHT_FOREST -> Icons.Default.DarkMode
                            },
                            contentDescription = "تغيير المظهر",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Memory / Backup Button
                    IconButton(
                        onClick = onOpenMemoryModal,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Storage,
                            contentDescription = "الذاكرة",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}
