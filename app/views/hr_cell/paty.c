#include<stdio.h>
#include <stdlib.h>
#define size 10
#define infinity 9999 
int a[4][4]={{0,5,0,9},{2,0,1,3},{0,0,0,2},{0,1,0,0}};
void path( int s, int d){
	int i,j;
	for(i=0;i<4;i++){
		
		if(a[s][i]>0){
			printf("%d%d",s,i);
			path(i,d)
			break;
		}
			
			
	}
	
}
void output(){
	printf("\n adjacency matrix\n");
	for(i=0;i<number;i++){
		for(j=0;j<number;j++){
			printf("%d",a[i][j]);
		}
		printf("\n");
	}
}
void path(){
	for(k=0;k<number;k++){
		for(i=0;i<number;i++){
			for(j=0;j<number;j++){
					if(a[i][j]<=a[i][k]+a[k][j])
				       a[i][j]=a[i][j];
			        else
				        a[i][j]=a[i][k]+a[k][j];
			}
			
		}
		printf("\n step %d\n",k);
		output();
	}
}
int main(){
    input(number,a);
    path();
    
	output();
	
}

