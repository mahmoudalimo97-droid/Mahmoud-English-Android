package com.mahmoudenglish.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.ui.theme.*

@Composable
fun ContactScreen() {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Teacher Profile Card
        Surface(
            shape = RoundedCornerShape(22.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 3.dp,
            shadowElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(Emerald800),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "M",
                        color = Color.White,
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "مستر محمود علي",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "معلم وخبير اللغة الإنجليزية ومطور المنظومة",
                        fontSize = 12.sp,
                        color = Emerald700,
                        fontWeight = FontWeight.Medium
                    )
                }

                Text(
                    text = "يسعدني دائماً تواصلكم للاستفسارات التعليمية وتصميم كتب ومذكرات ومناهج تعليمية واونلاين ومتابعة الطلاب.",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 20.sp
                )
            }
        }

        // Educational Services Offered
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "الخدمات التعليمية المتخصصة",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Emerald800
                )

                // 1. Inquiries
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(imageVector = Icons.Default.HelpOutline, contentDescription = null, tint = Emerald700, modifier = Modifier.size(20.dp))
                    Column {
                        Text(text = "استفسارات تعليمية وتوجيه لغوي", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "إجابة أسئلة القواعد ومتابعة نطق وتأسيس الطلاب.", fontSize = 11.sp, color = Stone600)
                    }
                }

                Divider(color = MaterialTheme.colorScheme.surfaceVariant)

                // 2. Booklets
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(imageVector = Icons.Default.MenuBook, contentDescription = null, tint = Indigo800, modifier = Modifier.size(20.dp))
                    Column {
                        Text(text = "تصميم كتب ومذكرات تعليمية", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "إعداد وتنسيق مذكرات شروحات، ملازم مراجعة، وكتب تأسيس.", fontSize = 11.sp, color = Stone600)
                    }
                }

                Divider(color = MaterialTheme.colorScheme.surfaceVariant)

                // 3. Curriculum
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(imageVector = Icons.Default.School, contentDescription = null, tint = Blue800, modifier = Modifier.size(20.dp))
                    Column {
                        Text(text = "تصميم وتطوير مناهج تعليمية", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "تأليف مناهج لغة إنجليزية تفاعلية للمدارس والمراكز.", fontSize = 11.sp, color = Stone600)
                    }
                }

                Divider(color = MaterialTheme.colorScheme.surfaceVariant)

                // 4. Online
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(imageVector = Icons.Default.LaptopMac, contentDescription = null, tint = Teal700, modifier = Modifier.size(20.dp))
                    Column {
                        Text(text = "دروس ومحاضرات أونلاين", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "حصص تفاعلية مباشرة عبر الإنترنت لشرح المناهج.", fontSize = 11.sp, color = Stone600)
                    }
                }
            }
        }

        // Action: WhatsApp
        Surface(
            shape = RoundedCornerShape(18.dp),
            color = Color(0xFF25D366),
            shadowElevation = 3.dp,
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/201287073964"))
                    context.startActivity(intent)
                }
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Chat,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "دردشة واتساب مباشرة",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "01287073964",
                        fontSize = 12.sp,
                        color = Color(0xFFE8F5E9)
                    )
                }

                Icon(
                    imageVector = Icons.Default.ArrowForwardIos,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        // Action: Direct Call
        Surface(
            shape = RoundedCornerShape(18.dp),
            color = Emerald800,
            shadowElevation = 3.dp,
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:01287073964"))
                    context.startActivity(intent)
                }
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "اتصال مباشر (مستر محمود)",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "01287073964",
                        fontSize = 12.sp,
                        color = Emerald100
                    )
                }

                Icon(
                    imageVector = Icons.Default.ArrowForwardIos,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
