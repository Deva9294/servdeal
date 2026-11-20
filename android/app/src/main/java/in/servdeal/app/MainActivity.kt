package in.servdeal.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch

private val Orange = Color(0xFFFF7A00)
private val Navy = Color(0xFF10264A)
private val Canvas = Color(0xFFF6F7F9)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(246,247,249)
        window.navigationBarColor = android.graphics.Color.WHITE
        setContent { MaterialTheme(colorScheme = lightColorScheme(primary=Orange, secondary=Navy, background=Canvas)) { ServDealApp() } }
    }
}

class ServViewModel : ViewModel() {
    var services by mutableStateOf<List<ServiceItem>>(emptyList()); private set
    var bookings by mutableStateOf<List<BookingItem>>(emptyList()); private set
    var token by mutableStateOf<String?>(null); private set
    var userName by mutableStateOf("Guest"); private set
    var loading by mutableStateOf(false); private set
    var message by mutableStateOf("")
    init { loadServices() }
    fun loadServices() { viewModelScope.launch { loading=true; try { services=Api.client.services().data ?: emptyList(); message="" } catch(e:Exception){ message=e.message ?: "Unable to connect to ServDeal"; } finally { loading=false } } }
    fun login(email:String,password:String) { viewModelScope.launch { loading=true; try { val r=Api.client.login(mapOf("email" to email,"password" to password)); token=r.token; userName=r.user?.name ?: "ServDeal User"; loadBookings(); message="Login successful" } catch(e:Exception){ message=e.message ?: "Login failed" } finally { loading=false } } }
    fun loadBookings() { viewModelScope.launch { try { bookings=Api.client.myBookings("Bearer ${token ?: ""}").data ?: emptyList() } catch(e:Exception){ message=e.message ?: "Could not load bookings" } } }
    fun logout(){ token=null; userName="Guest"; bookings=emptyList() }
}

@Composable fun ServDealApp(vm: ServViewModel = viewModel()) {
    var tab by remember { mutableStateOf(0) }
    var selected by remember { mutableStateOf<ServiceItem?>(null) }
    var showLogin by remember { mutableStateOf(false) }
    Scaffold(containerColor=Canvas, bottomBar={
        NavigationBar(containerColor=Color.White) {
            listOf("Home","Services","Bookings","Account").forEachIndexed { i, label ->
                NavigationBarItem(selected=tab==i,onClick={tab=i;selected=null},icon={ Icon(when(i){0->Icons.Default.Home;1->Icons.Default.Search;2->Icons.Default.CalendarMonth;else->Icons.Default.Person},null) },label={Text(label)})
            }
        }
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            Row(Modifier.fillMaxWidth().background(Color.White).padding(horizontal=20.dp, vertical=16.dp),verticalAlignment=Alignment.CenterVertically) {
                Box(Modifier.size(42.dp).background(Orange,CircleShape),contentAlignment=Alignment.Center){Text("S",color=Color.White,fontSize=24.sp,fontWeight=FontWeight.Black)}
                Spacer(Modifier.width(10.dp)); Column(Modifier.weight(1f)){Text("ServDeal",fontSize=21.sp,fontWeight=FontWeight.ExtraBold,color=Navy);Text("FIXING PROBLEMS, DELIVERING TRUST",fontSize=8.sp,color=Color.Gray,letterSpacing=1.sp)}
                IconButton(onClick={ if(vm.token==null) showLogin=true else vm.loadBookings() }) { Icon(Icons.Default.NotificationsNone,null,tint=Navy) }
            }
            when {
                selected!=null -> ServiceDetail(selected!!, onBack={selected=null}, onLogin={showLogin=true}, loggedIn=vm.token!=null)
                tab==0 || tab==1 -> HomeContent(vm, onSelect={selected=it})
                tab==2 -> BookingContent(vm, onLogin={showLogin=true})
                else -> AccountContent(vm,onLogin={showLogin=true})
            }
        }
    }
    if(showLogin) LoginDialog(onDismiss={showLogin=false},onLogin={e,p->vm.login(e,p);showLogin=false},loading=vm.loading)
}

@Composable private fun HomeContent(vm:ServViewModel,onSelect:(ServiceItem)->Unit) {
    LazyColumn(contentPadding=PaddingValues(16.dp),verticalArrangement=Arrangement.spacedBy(14.dp)) {
        item {
            Column(Modifier.fillMaxWidth().background(Navy,RoundedCornerShape(22.dp)).padding(20.dp)) {
                Text("YOUR HOME, OUR CARE",color=Color(0xFFFFC58F),fontSize=11.sp,fontWeight=FontWeight.Bold)
                Spacer(Modifier.height(8.dp));Text("Trusted services\nat your doorstep.",fontSize=27.sp,lineHeight=32.sp,fontWeight=FontWeight.Bold,color=Color.White)
                Spacer(Modifier.height(8.dp));Text("Book verified professionals near you.",color=Color.White.copy(alpha=.8f))
                Spacer(Modifier.height(16.dp));Button(onClick={vm.loadServices()},colors=ButtonDefaults.buttonColors(containerColor=Orange)){Text("Explore services")}
            }
        }
        item { Text("Popular services",fontSize=20.sp,fontWeight=FontWeight.Bold,color=Navy) }
        if(vm.loading && vm.services.isEmpty()) item { LinearProgressIndicator(Modifier.fillMaxWidth(),color=Orange) }
        if(vm.services.isEmpty()) item { EmptyState(vm.message.ifBlank{"Services are loading from the live ServDeal server."}, onRetry={vm.loadServices()}) }
        items(vm.services.take(30)) { service ->
            Card(Modifier.fillMaxWidth().clickable{onSelect(service)},shape=RoundedCornerShape(16.dp),colors=CardDefaults.cardColors(containerColor=Color.White)) {
                Row(Modifier.padding(16.dp),verticalAlignment=Alignment.CenterVertically) {
                    Box(Modifier.size(50.dp).background(Color(0xFFFFF1E5),RoundedCornerShape(14.dp)),contentAlignment=Alignment.Center){Icon(Icons.Default.Handyman,null,tint=Orange)}
                    Spacer(Modifier.width(14.dp));Column(Modifier.weight(1f)){Text(service.name ?: "Home service",fontWeight=FontWeight.Bold,color=Navy,fontSize=16.sp);Text(service.shortDescription ?: service.description ?: "Professional service",color=Color.Gray,fontSize=12.sp,maxLines=2)}
                    Text(if((service.basePrice ?: 0.0)>0) "₹${service.basePrice}" else "View",fontWeight=FontWeight.Bold,color=Orange)
                }
            }
        }
        item { Text("Live data from ServDeal API • Secure account • Real booking records",fontSize=11.sp,color=Color.Gray) }
    }
}

@Composable private fun ServiceDetail(item:ServiceItem,onBack:()->Unit,onLogin:()->Unit,loggedIn:Boolean) {
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("‹  Back",Modifier.clickable{onBack()},color=Orange,fontWeight=FontWeight.Bold)
        Spacer(Modifier.height(22.dp));Box(Modifier.size(76.dp).background(Color(0xFFFFF1E5),RoundedCornerShape(20.dp)),contentAlignment=Alignment.Center){Icon(Icons.Default.HomeRepairService,null,tint=Orange,modifier=Modifier.size(38.dp))}
        Spacer(Modifier.height(18.dp));Text(item.name ?: "Service",fontSize=26.sp,fontWeight=FontWeight.Bold,color=Navy)
        Text(item.description ?: item.shortDescription ?: "Book trusted professionals with ServDeal.",color=Color.Gray)
        Spacer(Modifier.height(12.dp));Text("Starting price: ₹${item.basePrice ?: 0}",fontWeight=FontWeight.Bold,color=Orange)
        Spacer(Modifier.height(22.dp));Text("Booking requires a verified, available provider and your service address. These are validated by the live ServDeal backend.",color=Color.Gray)
        Spacer(Modifier.height(18.dp));Button(onClick=onLogin,modifier=Modifier.fillMaxWidth(),colors=ButtonDefaults.buttonColors(containerColor=Orange)){Text(if(loggedIn)"Continue to account" else "Login to continue")}
    }
}

@Composable private fun BookingContent(vm:ServViewModel,onLogin:()->Unit) {
    if(vm.token==null) { EmptyState("Login to view your real bookings.",onRetry=onLogin);return }
    Column(Modifier.fillMaxSize().padding(18.dp)) {
        Row(verticalAlignment=Alignment.CenterVertically){Text("My bookings",fontSize=22.sp,fontWeight=FontWeight.Bold,color=Navy);Spacer(Modifier.weight(1f));TextButton(onClick={vm.loadBookings()}){Text("Refresh",color=Orange)}}
        if(vm.bookings.isEmpty()) EmptyState("No bookings found in your account.",onRetry={vm.loadBookings()})
        else LazyColumn(verticalArrangement=Arrangement.spacedBy(10.dp)){items(vm.bookings){b->Card(colors=CardDefaults.cardColors(containerColor=Color.White)){Column(Modifier.padding(16.dp)){Text(b.bookingId ?: "ServDeal booking",fontWeight=FontWeight.Bold,color=Navy);Text(b.status ?: "pending",color=Orange);Text(b.category ?: b.service?.name ?: "Home service",color=Color.Gray)}}}}
    }
}

@Composable private fun AccountContent(vm:ServViewModel,onLogin:()->Unit) {
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("My account",fontSize=23.sp,fontWeight=FontWeight.Bold,color=Navy);Spacer(Modifier.height(16.dp))
        Card(colors=CardDefaults.cardColors(containerColor=Color.White)){Row(Modifier.fillMaxWidth().padding(18.dp),verticalAlignment=Alignment.CenterVertically){Icon(Icons.Default.AccountCircle,null,tint=Orange,modifier=Modifier.size(42.dp));Spacer(Modifier.width(12.dp));Column(Modifier.weight(1f)){Text(vm.userName,fontWeight=FontWeight.Bold,color=Navy);Text(if(vm.token==null)"Sign in to sync your account" else "Connected to ServDeal",color=Color.Gray,fontSize=12.sp)};if(vm.token==null)Button(onClick=onLogin,colors=ButtonDefaults.buttonColors(containerColor=Orange)){Text("Login")}else TextButton(onClick={vm.logout()}){Text("Logout",color=Orange)}}}
        Spacer(Modifier.height(14.dp));Text("ServDeal • Powered by your existing account and database",color=Color.Gray,fontSize=12.sp)
    }
}

@Composable private fun EmptyState(text:String,onRetry:()->Unit) { Column(Modifier.fillMaxWidth().padding(24.dp),horizontalAlignment=Alignment.CenterHorizontally){Icon(Icons.Default.CloudOff,null,tint=Color.Gray,modifier=Modifier.size(34.dp));Spacer(Modifier.height(10.dp));Text(text,color=Color.Gray);TextButton(onClick=onRetry){Text("Try again",color=Orange)}} }

@Composable private fun LoginDialog(onDismiss:()->Unit,onLogin:(String,String)->Unit,loading:Boolean) {
    var email by remember{mutableStateOf("")};var password by remember{mutableStateOf("")}
    AlertDialog(onDismissRequest=onDismiss,title={Text("Login to ServDeal")},text={Column(verticalArrangement=Arrangement.spacedBy(10.dp)){OutlinedTextField(email,{email=it},label={Text("Email")},singleLine=true);OutlinedTextField(password,{password=it},label={Text("Password")},singleLine=true)}},confirmButton={Button(onClick={onLogin(email,password)},enabled=email.isNotBlank()&&password.isNotBlank()&&!loading,colors=ButtonDefaults.buttonColors(containerColor=Orange)){Text(if(loading)"Please wait" else "Login")}},dismissButton={TextButton(onClick=onDismiss){Text("Cancel")}})
}
