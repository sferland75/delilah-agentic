                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          control={control}
                          name={`${prefix}.${section.region}.${group.name}.notes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Note any pain, compensations, or other observations..."
                                  className="min-h-[80px]"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value) {
                                      setModifiedSections(prev => 
                                        prev.includes(section.region) ? prev : [...prev, section.region]
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {modifiedSections.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <FormField
            control={control}
            name={`${prefix}.generalNotes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Assessment Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter overall observations, patterns, and functional implications..."
                    className="min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}

      <Collapsible className="bg-slate-50 rounded-lg border border-slate-200">
        <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-slate-100">
          <Info className="h-4 w-4 text-slate-600" />
          <h4 className="font-medium text-slate-800">MMT Grade Reference</h4>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            {MMT_GRADES.map((grade) => (
              <div key={grade.value} className="flex items-start gap-2">
                <Badge variant="outline">{grade.value}</Badge>
                <div className="text-sm">
                  <div className="font-medium">{grade.label}</div>
                  <div className="text-slate-600">{grade.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}