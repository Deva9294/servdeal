package in.servdeal.app

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

data class ApiResponse<T>(val success:Boolean=false,val data:T?=null,val token:String?=null,val user:UserDto?=null,val message:String?=null)
data class UserDto(val id:String?=null,val name:String?=null,val email:String?=null,val phone:String?=null,val role:String?=null)
data class ServiceItem(val _id:String?=null,val name:String?=null,val slug:String?=null,val icon:String?=null,val description:String?=null,val shortDescription:String?=null,val basePrice:Double?=null)
data class BookingItem(val _id:String?=null,val bookingId:String?=null,val status:String?=null,val category:String?=null,val service:ServiceItem?=null)

interface ServDealApi {
    @POST("auth/login") suspend fun login(@Body body:Map<String,String>):ApiResponse<Any>
    @GET("auth/me") suspend fun me(@Header("Authorization") token:String):ApiResponse<UserDto>
    @GET("services") suspend fun services():ApiResponse<List<ServiceItem>>
    @GET("services/categories") suspend fun categories():ApiResponse<List<Map<String,Any>>>
    @GET("bookings/my") suspend fun myBookings(@Header("Authorization") token:String):ApiResponse<List<BookingItem>>
}
object Api {
    val client:ServDealApi by lazy {
        val http=OkHttpClient.Builder().addInterceptor(Interceptor { chain ->
            val request=chain.request().newBuilder().header("Accept","application/json").build()
            chain.proceed(request)
        }).build()
        Retrofit.Builder().baseUrl(BuildConfig.API_BASE_URL).client(http).addConverterFactory(GsonConverterFactory.create()).build().create(ServDealApi::class.java)
    }
}
