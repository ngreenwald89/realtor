from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
# from django.db.models import Q

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

import json
# import twython import Twython


from .forms import UserForm, LoginForm, SearchForm
from .models import Neighborhood, Ages, Economic, SchoolEducation, Building, Demographic, UnitValue, UnitDescription


class Index(View):
	def get(self, request):
		context = {}
		# check to see if someone is already logged in
		if request.user.is_authenticated(): 
			# get their username  
			username = request.user.username
			context = {
				'username': username,}

		user_form = UserForm()
		login_form = LoginForm()

		context ["user_form"] = user_form
		context ["login_form"] = login_form

		return render(request, "index.html", context)


class Register(View):
	def post(self, request):
		if request.is_ajax():
			data = request.POST
		else:
			body = request.body.decode()
			if not body: 
				return JsonResponse ({"response":"Missing Body"})
			data = json.loads(body)

		user_form = UserForm(data)
		if user_form.is_valid():
			user = user_form.save()
			return JsonResponse({"Message": "Register succesfull", "success": True})
		else:
			return JsonResponse ({"response":"Invalid information"})


class Login(View):
	def post(self, request):
		if request.is_ajax():
			data = request.POST
		else:
			body = request.body.decode()
			if not body: 
				return JsonResponse ({"response":"Missing Body"})
			data = json.loads(body)

		username = data.get('username')
		password = data.get('password')
		if not (username and password):
			return JsonResponse({'Message':'Missing username or password.'})
		user = authenticate(username=username, password=password)

		if user:
			if user.is_active:
				login(request, user) # django built in login 
				username = request.user.username
				return JsonResponse({'Message':'Welcome in!', "username":username, "success": True})
			else:
				return JsonResponse({'Message':'Username is inactive'})
		else:
			return JsonResponse({'Message':'Invalid `username` or `password`.'})


class Logout(View):
	def post(self, request):
		print(request)
		logout(request) # django built in logout 
		return JsonResponse ({"Message":"Logout Successful"})


class Search(View):
    def post(self,request):
    	form = SearchForm(request.POST)
    	import pprint
    	pprint.pprint(form.is_valid())
    	pprint.pprint(form.cleaned_data)

    	# if form.is_valid():
    	# 	# form.execute_queries()
    	# 	Algorithm(form)

    	return JsonResponse({"success": True})

class Results(View):
	def post(self,request):
		pass










