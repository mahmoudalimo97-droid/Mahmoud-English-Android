package com.mahmoudenglish.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mahmoudenglish.app.model.DetectedObject
import com.mahmoudenglish.app.model.ScanResult
import com.mahmoudenglish.app.model.VocabWord
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper

@Composable
fun CameraTranslatorScreen(
    scanResult: ScanResult?,
    isScanning: Boolean,
    onCaptureClick: () -> Unit,
    onSaveWord: (VocabWord) -> Unit,
    tts: TextToSpeechHelper
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(vertical = 14.dp)
    ) {
        // Camera Viewfinder / Capture Card
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color.Black),
                        contentAlignment = Alignment.Center
                    ) {
                        if (scanResult != null && scanResult.imageUrl.isNotBlank()) {
                            AsyncImage(
                                model = scanResult.imageUrl,
                                contentDescription = "Captured view",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        } else {
                            Column(
                                horizontalAlignment = Alignment.CenterVertically,
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CameraAlt,
                                    contentDescription = null,
                                    tint = Color.White.copy(alpha = 0.7f),
                                    modifier = Modifier.size(48.dp)
                                )
                                Text(
                                    text = "وجّه الكاميرا نحو أي شيء أو نص للترجمة والتعلم",
                                    color = Color.White.copy(alpha = 0.8f),
                                    fontSize = 12.sp
                                )
                            }
                        }

                        // Scanning animation / progress
                        if (isScanning) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(Color.Black.copy(alpha = 0.6f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterVertically) {
                                    CircularProgressIndicator(color = Emerald500)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "جاري مسح وتحليل الصورة...",
                                        color = Color.White,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }

                    // Capture Trigger Button
                    Button(
                        onClick = onCaptureClick,
                        enabled = !isScanning,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Camera, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isScanning) "جاري المعالجة..." else "التقاط صورة للترجمة الفورية",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }

        // Detected Objects Section
        if (scanResult != null) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "العناصر المكتشفة بالصورة (${scanResult.detectedObjects.size}):",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Button(
                        onClick = {
                            scanResult.detectedObjects.forEach {
                                tts.speakWordWithExplanation(it.english, it.arabic)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(12.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "قراءة الكل بالصوت", fontSize = 11.sp)
                    }
                }
            }

            items(scanResult.detectedObjects) { obj ->
                DetectedObjectCard(
                    item = obj,
                    onSave = {
                        onSaveWord(
                            VocabWord(
                                id = "saved-${obj.id}",
                                english = obj.english,
                                arabic = obj.arabic,
                                phonetic = obj.phonetic,
                                category = "مسح بالكاميرا",
                                exampleEn = obj.exampleSentenceEn,
                                exampleAr = obj.exampleSentenceAr,
                                imageUrl = obj.imageUrl,
                                iconEmoji = obj.iconEmoji
                            )
                        )
                    },
                    tts = tts
                )
            }
        }
    }
}

@Composable
fun DetectedObjectCard(
    item: DetectedObject,
    onSave: () -> Unit,
    tts: TextToSpeechHelper
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(text = item.iconEmoji ?: "📦", fontSize = 24.sp)
                    Column {
                        Text(
                            text = item.english,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = item.phonetic,
                                fontSize = 11.sp,
                                color = Emerald800,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = item.arabic,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    IconButton(
                        onClick = { tts.speakEnglish(item.english) },
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Emerald50)
                    ) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "Pronounce",
                            tint = Emerald800,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    IconButton(
                        onClick = onSave,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Stone100)
                    ) {
                        Icon(
                            imageVector = Icons.Default.BookmarkBorder,
                            contentDescription = "Save word",
                            tint = Emerald800,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Bilingual Voice Button
            OutlinedButton(
                onClick = { tts.speakWordWithExplanation(item.english, item.arabic) },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(vertical = 6.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.RecordVoiceOver,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = Emerald800
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "نطق الكلمة ثم قراءة الترجمة بالعربية 🗣️",
                    fontSize = 11.sp,
                    color = Emerald800,
                    fontWeight = FontWeight.SemiBold
                )
            }

            if (!item.exampleSentenceEn.isNullOrBlank()) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Emerald50,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "\"${item.exampleSentenceEn}\"",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                fontFamily = FontFamily.Serif
                            )
                            IconButton(
                                onClick = { tts.speakEnglish(item.exampleSentenceEn) },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.VolumeUp,
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp),
                                    tint = Emerald800
                                )
                            }
                        }
                        if (!item.exampleSentenceAr.isNullOrBlank()) {
                            Text(
                                text = item.exampleSentenceAr,
                                fontSize = 11.sp,
                                color = Stone600
                            )
                        }
                    }
                }
            }
        }
    }
}
