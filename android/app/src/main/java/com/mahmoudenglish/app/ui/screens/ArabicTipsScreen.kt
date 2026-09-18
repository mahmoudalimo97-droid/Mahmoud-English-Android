package com.mahmoudenglish.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.data.DefaultData
import com.mahmoudenglish.app.model.EducationalTip
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper

@Composable
fun ArabicTipsScreen(
    tips: List<EducationalTip> = DefaultData.TIPS,
    tts: TextToSpeechHelper
) {
    var userGoalInput by remember { mutableStateOf("") }
    var generatedAdvice by remember { mutableStateOf<String?>(null) }
    var isGenerating by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(vertical = 14.dp)
    ) {
        // AI Advice Requester Card
        item {
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Amber800)
                        Text(
                            text = "اطلب نصيحة مخصصة من الذكاء الاصطناعي",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald900
                        )
                    }

                    OutlinedTextField(
                        value = userGoalInput,
                        onValueChange = { userGoalInput = it },
                        placeholder = { Text(text = "مثال: كيف أتغلب على الخجل أثناء الحديث بالإنجليزية؟", fontSize = 12.sp) },
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Button(
                        onClick = {
                            if (userGoalInput.isNotBlank()) {
                                isGenerating = true
                                tts.playUiSound("tap")
                                // Simulated AI advice
                                generatedAdvice = "نصيحة ذهبية: سجل صوتك يومياً لمدة دقيقة واحدة وأنت تتحدث عن يومك دون القلق من الأخطاء، ثم استمع للتسجيل. ستلاحظ أن حاجز الخجل ينكسر بعد أسبوع واحد فقط!"
                                isGenerating = false
                                tts.playUiSound("success")
                                tts.speakArabic(generatedAdvice ?: "")
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.Lightbulb, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "توليد نصيحة فورية بالصوت", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }

                    if (generatedAdvice != null) {
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = Amber50,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(
                                    text = generatedAdvice ?: "",
                                    fontSize = 12.sp,
                                    lineHeight = 18.sp,
                                    color = Amber900,
                                    fontWeight = FontWeight.Medium
                                )
                                IconButton(
                                    onClick = { tts.speakArabic(generatedAdvice ?: "") },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Amber800)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section Title
        item {
            Text(
                text = "أهم نصائح وإرشادات التحدث السريع:",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        }

        // Tips List
        items(tips) { tip ->
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Emerald100
                        ) {
                            Text(
                                text = tip.category,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald950,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }

                        IconButton(
                            onClick = { tts.speakArabic("${tip.titleAr}. ${tip.tipAr}") },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Emerald800)
                        }
                    }

                    Text(
                        text = tip.titleAr,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Text(
                        text = tip.tipAr,
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        color = Stone600
                    )

                    if (!tip.exampleEn.isNullOrBlank()) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = tip.exampleEn,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Serif
                                    )
                                    if (!tip.exampleAr.isNullOrBlank()) {
                                        Text(
                                            text = tip.exampleAr,
                                            fontSize = 11.sp,
                                            color = Stone500
                                        )
                                    }
                                }
                                IconButton(
                                    onClick = { tts.speakEnglish(tip.exampleEn) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Emerald800)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
